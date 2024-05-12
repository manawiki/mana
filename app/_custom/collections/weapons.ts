import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Weapons: CollectionConfig = {
   slug: "weapons",
   labels: { singular: "weapon", plural: "weapons" },
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
         name: "desc",
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
         name: "type",
         type: "relationship",
         relationTo: "weapon-types",
      },
      {
         name: "splash",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "stats",
         type: "array",
         fields: [
            {
               name: "attribute",
               type: "relationship",
               relationTo: "attributes",
            },
            {
               name: "value",
               type: "number",
            },
            {
               name: "percent",
               type: "select",
               options: [
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
               ],
            },
            {
               name: "curve",
               type: "relationship",
               relationTo: "weapon-curves",
            }
         ],
      },
      {
         name: "skill_name",
         type: "text",
      },
      {
         name: "skill_desc",
         type: "text",
      },
      {
         name: "skill_params",
         type: "json",
      },
      {
         name: "ascension_costs",
         type: "array",
         fields: [
            {
               name: "items",
               type: "array",
               fields: [
                  {
                     name: "item",
                     type: "relationship",
                     relationTo: "items",
                  },
                  {
                     name: "cnt",
                     type: "number",
                  },
               ],
            },
            {
               name: "gold",
               type: "number",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
