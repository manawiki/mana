import type { Payload } from "payload";
import payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;
const EXCLUDED_COLLECTIONS = ["_preferences", "search", "users"];

const wipeCollections = async (): Promise<void> => {
   for (const slug in payload.collections) {
      if (EXCLUDED_COLLECTIONS.includes(slug)) {
         continue;
      }

      await payload.delete({
         collection: slug,
         where: {},
      });

      console.log(`[*] Wiped ${slug}...`);
   }
};

const run = async (): Promise<void> => {
   await payload.init({
      secret: PAYLOADCMS_SECRET as string,
      mongoURL: CUSTOM_MONGO_URL as string,
      local: true,
      onInit: (_payload: Payload) => {
         _payload.logger.info("Payload initialized...");
      },
   });

   await wipeCollections().then(
      () => {
         process.exit(0);
      },
      (err) => {
         console.error(err);
         process.exit(-1);
      }
   );
};

run();
