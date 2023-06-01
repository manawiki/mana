import path from "path";
import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import { createRequestHandler } from "@remix-run/express";
import invariant from "tiny-invariant";
import nodemailer from "nodemailer";
import coreBuildConfig from "./app/db/payload.config";
import chokidar from "chokidar";
import { broadcastDevReady } from "@remix-run/node";

require("dotenv").config();

const BUILD_DIR = path.join(process.cwd(), "build");

const cors = require("cors");

const transport = nodemailer.createTransport({
   host: process.env.PAYLOAD_NODEMAILER_HOST,
   port: parseInt(process.env.PAYLOAD_NODEMAILER_PORT),
   secure: false,
   auth: {
      user: process.env.PAYLOAD_NODEMAILER_USER,
      pass: process.env.PAYLOAD_NODEMAILER_PASSWORD,
   },
});

const corsOptions = {
   origin: [
      "https://mana.wiki",
      "https://starrail-static.mana.wiki",
      "https://static.mana.wiki",
      "http://localhost:3000",
   ],
};

//Start core site (remix + payload instance)

async function startCore() {
   const app = express();

   app.use(cors(corsOptions));

   // Redirect all traffic at root to HQ UI
   app.get("/", function (_, res) {
      res.redirect("/hq");
   });

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
                 fromName: "No Reply - Mana Wiki",
                 fromAddress: "dev@mana.wiki",
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

   // no ending slashes for SEO reasons
   app.use((req, res, next) => {
      if (req.path.endsWith("/") && req.path.length > 1) {
         const query = req.url.slice(req.path.length);
         const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
         res.redirect(301, safepath + query);
      } else {
         next();
      }
   });

   // Remix fingerprints its assets so we can cache forever.
   app.use(
      "/build",
      express.static("public/build", { immutable: true, maxAge: "1y" })
   );

   // Aggressively cache fonts for a year
   app.use(
      "/fonts",
      express.static("public/fonts", { immutable: true, maxAge: "1y" })
   );

   // Everything else (like favicon.ico) is cached for an hour. You may want to be
   // more aggressive with this caching.
   app.use(express.static("public", { maxAge: "1h" }));

   app.use(morgan("tiny"));
   app.use(payload.authenticate);

   app.all(
      "*",
      process.env.NODE_ENV === "development"
         ? (req, res, next) => {
              return createRequestHandler({
                 build: require(BUILD_DIR),
                 mode: process.env.NODE_ENV,
                 getLoadContext(req, res) {
                    return {
                       // @ts-expect-error
                       payload: req.payload,
                       // @ts-expect-error
                       user: req?.user,
                       res,
                    };
                 },
              })(req, res, next);
           }
         : createRequestHandler({
              build: require(BUILD_DIR),
              mode: process.env.NODE_ENV,
              getLoadContext(req, res) {
                 return {
                    // @ts-expect-error
                    payload: req.payload,
                    // @ts-expect-error
                    user: req?.user,
                    res,
                 };
              },
           })
   );
   const port = process.env.PORT || 3000;

   app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);

      if (process.env.NODE_ENV === "development") {
         broadcastDevReady(require(BUILD_DIR));
      }
   });
}

startCore();

// during dev, we'll keep the build module up to date with the changes
if (process.env.NODE_ENV === "development") {
   const watcher = chokidar.watch(BUILD_DIR, {
      ignored: ["**/**.map"],
   });
   watcher.on("all", () => {
      for (const key in require.cache) {
         if (key.startsWith(BUILD_DIR)) {
            delete require.cache[key];
         }
      }
      broadcastDevReady(require(BUILD_DIR));
   });
}
