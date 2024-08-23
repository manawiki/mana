import Payload from "payload";

const fs = require("fs");

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

// Run this script with the following command:
// yarn cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/importers/redirectGenerator.ts

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL: `${process.env.CUSTOM_DB_URI}` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

async function mapper() {
   const results = await payload.find({
      collection: "pokemon",
      sort: "-id",
      limit: 5000,
   });

   // Generate CSV header
   const csvHeader = "Name,newURL,oldURL\n";

   // Generate CSV rows
   const csvRows = results.docs.map((row: any) => {
      const { name, slug, number, isShadow } = row;

      return `${name},https://pokemongo.gamepress.gg/c/pokemon/${slug},https://pogo.gamepress.gg/pokemon/${number}${
         isShadow ? `-shadow` : ""
      }${name.startsWith("Alolan") ? `-alolan` : ""}${
         name.startsWith("Mega") ? `-mega` : ""
      }
      ${name.startsWith("Hisuian") ? `-hisuian` : ""}${
         name.startsWith("Galarian") ? `-galarian` : ""
      }`;
   });

   // Combine header and rows
   const csvContent = csvHeader + csvRows.join("");

   // Write CSV file
   fs.writeFileSync("output.csv", csvContent);

   console.log("CSV export complete");

   process.exit(0);
}
