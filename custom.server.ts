import express from "express";
import compression from "compression";
import morgan from "morgan";
import payload from "payload";
import invariant from "tiny-invariant";
import nodemailerSendgrid from "nodemailer-sendgrid";
import customBuildConfig from "./app/db/payload.custom.config";

require("dotenv").config();
const cors = require("cors");

const corsOptions = {
   origin: [
      "https://mana.wiki",
      "https://starrail-static.mana.wiki",
      "http://localhost:3000",
   ],
};
//Start custom database (payload instance only)
async function startCustom() {
   const app = express();

   app.use(cors(corsOptions));

   // Redirect all traffic at root to admin UI
   app.get("/", function (_, res) {
      res.redirect("/admin");
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
      ...(process.env.SENDGRID_API_KEY
         ? {
              email: {
                 transportOptions: nodemailerSendgrid({
                    apiKey: process.env.SENDGRID_API_KEY,
                 }),
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

   app.disable("x-powered-by");

   app.use(morgan("tiny"));

   const port = process.env.PORT || 4000;

   app.listen(port, () => {
      console.log(`Custom server listening on port ${port}`);
   });
}
startCustom();
