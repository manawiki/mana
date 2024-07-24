import { nanoid } from "nanoid";
import Payload from "payload";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL: `${process.env.MONGODB_URI}/mana-prod` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

async function mapper() {
   const existingPokemonAnalysis = await payload.find({
      collection: "contentEmbeds",
      where: {
         site: { equals: "npY1abcTr6" },
         collectionEntity: { equals: "npY1abcTr6pokemon" },
      },
      limit: 10000,
   });

   // console.log(existingPokemonAnalysis.docs, "existingPokemonAnalysis");
   try {
      await Promise.all(
         existingPokemonAnalysis.docs.map(async (row: any) => {
            try {
               if (row?.content.length === 0) {
                  console.log(row.relationId);
                  console.log(row.content);

                  return await payload.update({
                     collection: "contentEmbeds",
                     id: row.id,
                     data: {
                        content: [
                           {
                              type: "paragraph",
                              id: nanoid(),
                              children: [
                                 {
                                    text: "",
                                 },
                              ],
                           },
                        ],
                     },
                  });
               }

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
