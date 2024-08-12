import Typesense from "typesense";

import { settings } from "../app/config";
import collectionSchema from "../app/db/collections/collections/collections-search-schema.json";
import customPageSchema from "../app/db/collections/custom-pages/custom-pages-schema.json";
import entrySchema from "../app/db/collections/entries/entries-search-schema.json";
import postSchema from "../app/db/collections/posts/posts-search-schema.json";

require("dotenv").config();

const initTypesenseSchema = async () => {
   let client = new Typesense.Client({
      apiKey: process.env.TYPESENSE_PRIVATE_KEY ?? "", // Be sure to use an API key that only allows search operations
      nodes: [
         {
            host: settings?.typesenseHost ?? "search.mana.wiki",
            port: 443,
            protocol: "https",
         },
      ],
      connectionTimeoutSeconds: 2,
   });

   // const searchOnlykey = await client.keys().create({
   //    description: "Search-only key.",
   //    actions: ["documents:search"],
   //    collections: ["*"],
   // });
   // console.log(searchOnlykey);

   const adminOnlykey = await client.keys().create({
      description: "Admin key.",
      actions: ["*"],
      collections: ["*"],
   });
   console.log(adminOnlykey);

   try {
      // console.log(await client.keys().retrieve());
      // await client.keys(0).delete();
      // await client.collections().create(postSchema as any);
      // await client.collections().create(postSchema as any);
      // await client.collections().create(customPageSchema as any);
      // await client.collections().create(entrySchema as any);
      // await client.collections().create(collectionSchema as any);
   } catch (e) {
      console.log(e);
   }

   console.log("Complete");
   process.exit(0);
};
initTypesenseSchema();
