import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Dolls: CollectionConfig = {
   slug: "dolls",
   labels: { singular: "doll", plural: "dolls" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "class",
         type: "relationship",
         relationTo: "classes",
      },
      {
         name: "company",
         type: "relationship",
         relationTo: "companies",
      },
      {
         name: "limited",
         type: "checkbox",
         defaultValue: false,
      },
      {
         name: "fragment",
         type: "relationship",
         relationTo: "items",
      },
      {
         name: "cv_ja",
         type: "text",
      },
      {
         name: "model",
         type: "text",
      },
      {
         name: "birthday",
         type: "text",
      },
      {
         name: "career",
         type: "text",
      },
      {
         name: "skins",
         type: "relationship",
         relationTo: "skins",
         hasMany: true,
      },
      {
         name: "liked_gifts",
         type: "relationship",
         relationTo: "items",
         hasMany: true,
      },
      {
         name: "disliked_gifts",
         type: "relationship",
         relationTo: "items",
         hasMany: true,
      },
      {
         name: "stories",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "content",
               type: "text",
            },
            {
               name: "intimacy_lv",
               type: "number",
            },
            {
               name: "voice_ja",
               type: "relationship",
               relationTo: "images",
            },
            {
               name: "rewards",
               type: "array",
               fields: [
                  {
                     name: "item",
                     type: "relationship",
                     relationTo: "items",
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ]
            }
         ]
      },
      {
         name: "voice_lines",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "content",
               type: "text",
            },
            {
               name: "voice_ja",
               type: "relationship",
               relationTo: "images",
            }
         ]
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
