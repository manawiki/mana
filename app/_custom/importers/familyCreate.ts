import path from "path";

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
      mongoURL:
         `${process.env.MONGODB_URI}/${process.env.CUSTOM_DB_NAME}` as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

async function mapper() {
   const requests = Array.from({ length: 15 }, (_, i) =>
      fetch(
         `https://gamepress.gg/pokemongo/pokemongo-family?page=${i}&_format=json`,
      ).then((response) => response.json()),
   );

   const getPokemon = await Promise.all(requests);

   const flattenedPokemon = getPokemon.flat();

   console.log(flattenedPokemon.length, "flattenedPokemon");

   const uniquePokemon = flattenedPokemon.reduce((acc, curr) => {
      const existingPokemon = acc.find(
         (pokemon: any) => pokemon.title === curr.title,
      );
      if (!existingPokemon) {
         acc.push(curr);
      }
      return acc;
   }, []);

   console.log(uniquePokemon.length, "uniquePokemon");

   try {
      await Promise.all(
         uniquePokemon.map(async (row: any) => {
            try {
               const existingPokemon = await payload.find({
                  collection: "pokemon",
                  where: { name: { equals: row?.title } },
               });

               if (existingPokemon.docs.length > 0) {
                  payload.logger.info(
                     `Document already exists for ${row?.title}`,
                  );
                  return;
               }
               await payload.create({
                  collection: "pokemon",
                  data: {
                     id: manaSlug(row?.title),
                     name: row?.title,
                     slug: manaSlug(row?.title),
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
