import compression from "compression";
import express from "express";
import morgan from "morgan";
import nodemailer from "nodemailer";
import payload from "payload";
import invariant from "tiny-invariant";

import { settings } from "./app/config";

require("dotenv").config();

const transport = nodemailer.createTransport({
   host: process.env.PAYLOAD_NODEMAILER_HOST,
   port: parseInt(process.env.PAYLOAD_NODEMAILER_PORT as string),
   secure: false,
   auth: {
      user: process.env.PAYLOAD_NODEMAILER_USER,
      pass: process.env.PAYLOAD_NODEMAILER_PASSWORD,
   },
});

//Start custom database (payload instance only)
async function startCustom() {
   const app = express();

   // Redirect all traffic at root to admin UI
   app.get("/", function (_, res) {
      res.redirect("/admin");
   });

   app.get("/robots.txt", function (_, res) {
      res.type("text/plain");
      res.send("User-agent: *\nDisallow: /");
   });

   invariant(process.env.PAYLOADCMS_SECRET, "PAYLOADCMS_SECRET is required");
   await payload.init({
      secret: process.env.PAYLOADCMS_SECRET,
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
