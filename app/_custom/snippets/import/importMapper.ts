import Payload from "payload";

import { delay } from "~/utils";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

const data = require("./example.json");

async function mapper() {
   try {
      await Promise.all(
         data.map(async (row: any) => {
            try {
               //Do stuff here
               delay(1000);
               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);
               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}

// const uploadImage = await payload.create({
//    collection: "images",
//    data: {
//       id,
//    },
//    filePath: path.resolve(__dirname, `./images/${id}.png`),
// });
