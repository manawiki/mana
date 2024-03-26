import compression from "compression";
import express from "express";
import morgan from "morgan";
import payload from "payload";
import invariant from "tiny-invariant";

require("dotenv").config();

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
   });

   app.use(compression());

   app.disable("x-powered-by");

   app.use(morgan("tiny"));

   const port = 4000;

   app.listen(port, () => {
      console.log(`Custom DB listening on port http://localhost:${port}`);
   });
}
startCustom();
