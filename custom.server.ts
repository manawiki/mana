import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import invariant from "tiny-invariant";
import customBuildConfig from "./app/db/payload.custom.config";
import nodemailer from "nodemailer";
import { settings } from "./mana.config";

require("dotenv").config();
const cors = require("cors");

const corsOptions = {
   origin: settings.corsOrigins,
};

const transport = nodemailer.createTransport({
   host: process.env.PAYLOAD_NODEMAILER_HOST,
   port: parseInt(process.env.PAYLOAD_NODEMAILER_PORT),
   secure: false,
   auth: {
      user: process.env.PAYLOAD_NODEMAILER_USER,
      pass: process.env.PAYLOAD_NODEMAILER_PASSWORD,
   },
});

//Start custom database (payload instance only)
async function startCustom() {
   const app = express();

   app.use(cors(corsOptions));

   // Redirect all traffic at root to admin UI
   app.get("/", function (_, res) {
      res.redirect("/admin");
   });

   app.get("/robots.txt", function (_, res) {
      res.type("text/plain");
      res.send("User-agent: *\nDisallow: /");
   });

   invariant(process.env.PAYLOADCMS_SECRET, "PAYLOADCMS_SECRET is required");
   invariant(process.env.CUSTOM_MONGO_URL, "CUSTOM_MONGO_URL is required");

   await payload.init({
      config: customBuildConfig,
      secret: process.env.PAYLOADCMS_SECRET,
      mongoURL: process.env.CUSTOM_MONGO_URL,
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

   app.disable("x-powered-by");

   app.use(morgan("tiny"));

   const port = process.env.PORT || 4000;

   app.listen(port, () => {
      console.log(`Custom server listening on port ${port}`);
   });
}
startCustom();
