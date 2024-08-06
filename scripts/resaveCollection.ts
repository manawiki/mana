import Payload from "payload";

import { manaSlug } from "../app/utils/url-slug";

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
         resaveCollection();
      },
   });
start();

const resaveCollection = async () => {
   const args = process.argv.slice(2); // nodejs command line args are an array that begin at the third item
   const [collectionSlug] = args || [];
   const results = await payload.find({
      collection: collectionSlug,
      depth: 2,
      sort: "-id",
      limit: 5000,
   });
   console.log(results.totalDocs);

   try {
      await Promise.all(
         results.docs.map(async (result: any) => {
            const { id } = result;
            if (collectionSlug) {
               try {
                  await payload.update({
                     collection: collectionSlug,
                     id,
                     depth: 0,
                     data: {
                        updatedAt: new Date(),
                        // slug: manaSlug(result.name),
                     },
                  });
                  console.log(
                     `Document in '${collectionSlug}' with id '${id}' updated successfully`,
                  );
               } catch (e) {
                  payload.logger.error(
                     `Document in '${collectionSlug}' with id '${id}' failed to update`,
                  );
                  payload.logger.error(e);
               }
            } else {
               console.log(
                  `No document found in '${collectionSlug}' with id '${id}'`,
               );
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
};
