import Payload from "payload";

import { manaSlug } from "../../utils/url-slug";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

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
   const familyEvolutionRequirements = await fetch(
      `https://pogo.gamepress.gg/candy-evo?_format=json`,
   ).then((response) => response.json());

   // https://pogo.gamepress.gg/evo-export?_format=json

   console.log(familyEvolutionRequirements.flat());

   try {
      await Promise.all(
         familyEvolutionRequirements.flat().map(async (row: any) => {
            try {
               const cleanedTitle = row?.name.replace(/&quot;/g, '"');

               await payload.create({
                  collection: "evolution-requirements",
                  data: {
                     id: manaSlug(cleanedTitle),
                     name: cleanedTitle,
                     slug: manaSlug(cleanedTitle),
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
