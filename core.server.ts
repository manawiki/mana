import * as path from "node:path";

import { createRequestHandler } from "@metronome-sh/express";
import { type RequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import nodemailer from "nodemailer";
import payload from "payload";
import sourceMapSupport from "source-map-support";
import invariant from "tiny-invariant";

import coreBuildConfig from "./app/db/payload.config";
import { settings, corsConfig } from "./mana.config";

// patch in Remix runtime globals
installGlobals();
require("dotenv").config();
sourceMapSupport.install();

// We'll make chokidar a dev dependency so it doesn't get bundled in production.
const chokidar =
   process.env.NODE_ENV === "development" ? require("chokidar") : null;

/**
 * @typedef {import('@remix-run/node').ServerBuild} ServerBuild
 */
const BUILD_PATH = path.resolve("./build/index.js");
const WATCH_PATH = path.resolve("./build/version.txt");

/**
 * Initial build
 * @type {ServerBuild}
 */
let build = require(BUILD_PATH);

const cors = require("cors");

const transport = nodemailer.createTransport({
   host: process.env.PAYLOAD_NODEMAILER_HOST,
   port: parseInt(process.env.PAYLOAD_NODEMAILER_PORT ?? "587"),
   secure: false,
   auth: {
      user: process.env.PAYLOAD_NODEMAILER_USER,
      pass: process.env.PAYLOAD_NODEMAILER_PASSWORD,
   },
});

//Start core site (remix + payload instance)
async function startCore() {
   const app = express();
   const { corsOrigins } = await corsConfig();
   app.use(cors({ origin: corsOrigins }));

   invariant(process.env.PAYLOADCMS_SECRET, "PAYLOADCMS_SECRET is required");
   invariant(process.env.MONGO_URL, "MONGO_URL is required");

   // Initialize Payload
   await payload.init({
      config: coreBuildConfig,
      secret: process.env.PAYLOADCMS_SECRET,
      mongoURL: process.env.MONGO_URL,
      express: app,
      onInit: () => {
         payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
      ...(process.env.PAYLOAD_NODEMAILER_HOST
         ? {
              email: {
                 transport,
                 fromName: settings.fromName,
                 fromAddress: settings.fromEmail,
              },
           }
         : {
              email: {
                 fromName: "Admin",
                 fromAddress: "admin@example.com",
                 logMockCredentials: true, // Optional
              },
           }),
   });

   app.use(compression());

   // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
   app.disable("x-powered-by");

   const getHost = (req: { get: (key: string) => string | undefined }) =>
      req.get("X-Forwarded-Host") ?? req.get("host") ?? "";

   app.use((req, res, next) => {
      //enforce https connection to make sure the site uses http2 protocol
      const proto = req.get("X-Forwarded-Proto");
      const host = getHost(req);
      // console.log("proto", proto, "host", host);
      if (proto === "http") {
         res.set("X-Forwarded-Proto", "https");
         res.redirect(`https://${host}${req.originalUrl}`);
         return;
      }

      // if they connect once with HTTPS, then they'll connect with HTTPS for the next hundred years
      res.set(
         "Strict-Transport-Security",
         "max-age=63072000; includeSubDomains; preload",
      );

      // no ending slashes for SEO reasons
      if (req.path.endsWith("/") && req.path.length > 1) {
         const query = req.url.slice(req.path.length);
         const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
         res.redirect(301, safepath + query);
         return;
      }

      next();
   });

   // Remix fingerprints its assets so we can cache forever.
   app.use(
      "/build",
      express.static("public/build", { immutable: true, maxAge: "1y" }),
   );

   // Aggressively cache fonts for a year
   app.use(
      "/fonts",
      express.static("public/fonts", { immutable: true, maxAge: "1y" }),
   );

   // Everything else (like favicon.ico) is cached for an hour. You may want to be
   // more aggressive with this caching.
   app.use(express.static("public", { maxAge: "1h" }));

   app.use(morgan("tiny"));
   app.use(payload.authenticate);

   // Check if the server is running in development mode and reflect realtime changes in the codebase.
   // We'll also inject payload in the remix handler so we can use it in our routes.
   app.all(
      "*",
      process.env.NODE_ENV === "development"
         ? createDevRequestHandler()
         : createProductionRequestHandler(),
   );
   const port = process.env.PORT || 3000;

   app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);

      if (process.env.NODE_ENV === "development") {
         broadcastDevReady(build);
      }
   });
}

startCore();

// Create a request handler for production
function createProductionRequestHandler(): RequestHandler {
   function getLoadContext(req: any, res: any) {
      return {
         payload: req.payload,
         user: req?.user,
         res,
      };
   }

   return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext,
   });
}

// Create a request handler that watches for changes to the server build during development.
function createDevRequestHandler(): RequestHandler {
   // Serverside RDT Remix Dev Tools
   const { withServerDevTools } = require("remix-development-tools/server");
   const devToolsConfig = {
      //        // Sets the ws port for the dev tools to communicate with the client dev tools
      wsPort: 3002,
      //  // allows you to not communicate at all with the client dev tools
      //  withWebsocket: boolean;
      //  // allows you to not log anything to the console
      //  silent: boolean;
      logs: {
         // allows you to not log cookie logs to the console
         cookies: true,
         // allows you to not log defer logs to the console
         defer: true,
         // allows you to not log action logs to the console
         actions: true,
         // allows you to not log loader logs to the console
         loaders: true,
         // allows you to not log cache logs to the console
         cache: true,
         // allows you to not log when cache is cleared to the console
         siteClear: true,
      },
   };

   async function handleServerUpdate() {
      // wrap the build with the dev tools
      build = withServerDevTools(await reimportServer(), devToolsConfig);

      // Add debugger to assist in v2 dev debugging
      if (build?.assets === undefined) {
         console.log(build.assets);
         debugger;
      }

      // 2. tell dev server that this app server is now up-to-date and ready
      broadcastDevReady(build);
   }

   chokidar
      .watch(WATCH_PATH, {
         ignoreInitial: true,
      })
      .on("add", handleServerUpdate)
      .on("change", handleServerUpdate);

   // wrap request handler to make sure its recreated with the latest build for every request
   return async (req, res, next) => {
      try {
         return createRequestHandler({
            build,
            mode: "development",
            getLoadContext(req, res) {
               return {
                  payload: req.payload,
                  user: req?.user,
                  res,
               };
            },
         })(req, res, next);
      } catch (error) {
         next(error);
      }
   };

   // CJS require cache busting
   /**
    * @type {() => Promise<ServerBuild>}
    */
   async function reimportServer() {
      // 1. manually remove the server build from the require cache
      Object.keys(require.cache).forEach((key) => {
         if (key.startsWith(BUILD_PATH)) {
            delete require.cache[key];
         }
      });

      // 2. re-import the server build
      return require(BUILD_PATH);
   }
}
