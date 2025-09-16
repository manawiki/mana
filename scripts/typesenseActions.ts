import Typesense from "typesense";

import { settings } from "../app/config";
import collectionSchema from "../app/db/collections/collections/collections-search-schema.json";
import customPageSchema from "../app/db/collections/custom-pages/custom-pages-schema.json";
import entrySchema from "../app/db/collections/entries/entries-search-schema.json";
import postSchema from "../app/db/collections/posts/posts-search-schema.json";

require("dotenv").config();

const initTypesenseSchema = async () => {
   let client = new Typesense.Client({
      apiKey: process.env.TYPESENSE_PRIVATE_KEY ?? "placeholder", // Be sure to use an API key that only allows search operations
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
   // console.log("searchOnlyKey:");
   // console.log(searchOnlykey);

   // const adminOnlykey = await client.keys().create({
   //    description: "Admin key.",
   //    actions: ["*"],
   //    collections: ["*"],
   // });
   // console.log("adminOnlykey:");
   // console.log(adminOnlykey);

   // ====
   // Define Schema
   // ====

   // let schema = {
   //    name: "entries",
   //    fields: [
   //       {
   //          name: "name",
   //          type: "string",
   //       },
   //       {
   //          name: "category",
   //          type: "string",
   //          facet: true,
   //       },
   //       {
   //          name: "collection",
   //          type: "string",
   //       },
   //       {
   //          name: "site",
   //          type: "string",
   //       },
   //    ],
   // };

   // let customPages_schema = {
   //    name: "customPages",
   //    fields: [
   //       {
   //          name: "name",
   //          type: "string",
   //       },
   //       {
   //          name: "category",
   //          type: "string",
   //       },
   //       {
   //          name: "site",
   //          type: "string",
   //       },
   //    ],
   // };

   // let collections_schema = {
   //    name: "collections",
   //    fields: [
   //       {
   //          name: "name",
   //          type: "string",
   //       },
   //       {
   //          name: "site",
   //          type: "string",
   //       },
   //    ],
   // };

   // let posts_schema = {
   //    name: "posts",
   //    fields: [
   //       {
   //          name: "name",
   //          type: "string",
   //       },
   //       {
   //          name: "category",
   //          type: "string",
   //          facet: true,
   //       },
   //       {
   //          name: "site",
   //          type: "string",
   //       },
   //    ],
   // };

   // await client.collections().create(schema);
   // await client.collections().create(customPages_schema);
   // await client.collections().create(collections_schema);
   // await client.collections().create(posts_schema);

   // ====
   // Update Schema
   // ====
   // let update_schema = {
   //    fields: [
   //       {
   //          name: "collection",
   //          type: "string",
   //       },
   //    ],
   // };
   // await client.collections("entries").update(update_schema);

   // ====
   // List Collections
   // ====
   // const collectionList = await client.collections().retrieve();
   // console.log(collectionList);

   // await client
   //    .collections("entries")
   //    .documents()
   //    .upsert({
   //       id: "servants-J959gyNV53-31",
   //       name: "Mash Kyrielight",
   //       relativeURL: "/c/servants/mash-kyrielight",
   //       absoluteURL:
   //          "https://grandorder.gamepress.gg/c/servants/mash-kyrielight",
   //       site: "J959gyNV53",
   //       collection: "servants",
   //       category: "Entry",
   //       ...{
   //          icon: {
   //             url: "https://static.mana.wiki/grandorder/001_Mash_Kyrielight_Icon.png",
   //          },
   //       },
   //    });

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
