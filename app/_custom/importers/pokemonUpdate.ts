import Payload from "payload";
import urlSlug from "url-slug";

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_MONGO_URL } = process.env;

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      mongoURL: CUSTOM_MONGO_URL as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

const data = require("./pokemon.json");

async function mapper() {
   const results = await payload.find({
      collection: "pokemon",
      sort: "-id",
      limit: 5000,
   });
   console.log(results.totalDocs);

   try {
      await Promise.all(
         results.docs.map(async (row: any) => {
            try {
               const newData = data.find(
                  (item) => urlSlug(item.title) == row.id,
               );

               await payload.update({
                  collection: "pokemon",
                  id: row.id,
                  data: {
                     shadowPokemon:
                        newData.field_shadow_pokemon &&
                        urlSlug(newData.field_shadow_pokemon),
                  },
               });
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
