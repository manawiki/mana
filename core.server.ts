import * as path from "node:path";

import { createRequestHandler, type RequestHandler } from "@remix-run/express";
import { broadcastDevReady, installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import nodemailer from "nodemailer";
import payload from "payload";
import sourceMapSupport from "source-map-support";
import invariant from "tiny-invariant";

import { settings } from "./app/config";

// patch in Remix runtime globals
installGlobals({});
require("dotenv").config();
sourceMapSupport.install();

// Make sure devDependencies don't ship to production
const chokidar =
   process.env.NODE_ENV === "development" ? require("chokidar") : null;
const rdt =
   process.env.NODE_ENV === "development"
      ? require("remix-development-tools/server")
      : null;

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

const transport = nodemailer.createTransport({
   host: process.env.NODEMAILER_HOST ?? "smtp.resend.com",
   port: parseInt(process.env.NODEMAILER_PORT ?? "465"),
   secure: true,
   auth: {
      user: process.env.NODEMAILER_USER ?? "resend",
      pass: process.env.NODEMAILER_PASSWORD,
   },
});

//Start core site (remix + payload instance)
async function startCore() {
   const app = express();

   invariant(process.env.PAYLOADCMS_SECRET, "PAYLOADCMS_SECRET is required");

   // Initialize Payload
   await payload.init({
      secret: process.env.PAYLOADCMS_SECRET,
      express: app,
      onInit: () => {
         payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      },
      ...(process.env.NODEMAILER_PASSWORD
         ? {
              email: {
                 transport,
                 fromName: settings?.fromName ?? "No Reply - Mana Wiki",
                 fromAddress: settings?.fromEmail ?? "dev@mana.wiki",
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
   app.use(
      "/icons",
      express.static("public/icons", { immutable: true, maxAge: "1y" }),
   );

   // Everything else (like favicon.ico) is cached for an hour. You may want to be
   // more aggressive with this caching.
   app.use(express.static("public", { maxAge: "1h" }));

   app.use(morgan("tiny"));
   app.use(payload.authenticate);

   // This makes sure the build is wrapped on reload by RDT
   if (rdt) build = rdt.withServerDevTools(build);

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
      console.log(`Express server listening on port http://localhost:${port}`);

      if (process.env.NODE_ENV === "development") {
         broadcastDevReady(build);
      }
   });
}

startCore();

// Create a request handler for production
function createProductionRequestHandler(): RequestHandler {
   return createRequestHandler({
      build,
      mode: process.env.NODE_ENV,
      getLoadContext(req, res) {
         const userData = req.user
            ? {
                 id: req?.user?.id,
                 roles: req?.user?.roles,
                 username: req?.user?.username,
                 avatar: {
                    id: req?.user?.avatar?.id,
                    url: req?.user?.avatar?.url,
                 },
              }
            : undefined;
         return {
            payload: req.payload,
            user: userData,
            res,
         };
      },
   });
}

// Create a request handler that watches for changes to the server build during development.
function createDevRequestHandler(): RequestHandler {
   async function handleServerUpdate() {
      // This makes sure the build is wrapped on reload by RDT
      build = rdt.withServerDevTools(await reimportServer());

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
            mode: process.env.NODE_ENV,
            getLoadContext(req, res) {
               const userData = req.user
                  ? {
                       id: req?.user?.id,
                       roles: req?.user?.roles,
                       username: req?.user?.username,
                       avatar: {
                          id: req?.user?.avatar?.id,
                          url: req?.user?.avatar?.url,
                       },
                    }
                  : undefined;
               return {
                  payload: req.payload,
                  user: userData,
                  res,
               };
            },
         })(req, res, next);
      } catch (error) {
         next(error);
      }
   };
}

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
