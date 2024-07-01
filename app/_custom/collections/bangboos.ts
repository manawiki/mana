import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Bangboos: CollectionConfig = {
   slug: "bangboos",
   labels: { singular: "bangboo", plural: "bangboos" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "name_en",
         type: "text",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "stats",
         type: "array",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "stats",
            },
            {
               name: "base",
               type: "number",
            },
            {
               name: "growth",
               type: "number",
            }
         ],
      },
      {
         name: "ascensions",
         type: "array",
         fields: [
            {
               name: "asc",
               type: "number",
            },
            {
               name: "lv_min",
               type: "number",
            },
            {
               name: "lv_max",
               type: "number",
            },
            {
               name: "stat_adv",
               type: "array",
               fields: [
                  {
                     name: "stat",
                     type: "relationship",
                     relationTo: "stats",
                  },
                  {
                     name: "value",
                     type: "number",
                  },
               ],
            },
            {
               name: "stat_add",
               type: "array",
               fields: [
                  {
                     name: "stat",
                     type: "relationship",
                     relationTo: "stats",
                  },
                  {
                     name: "value",
                     type: "number",
                  },
               ],
            },
            {
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "skills",
         type: "relationship",
         relationTo: ["bangboo-skills", "bangboo-talents"],
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
