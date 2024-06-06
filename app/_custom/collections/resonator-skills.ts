import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const ResonatorSkills: CollectionConfig = {
   slug: "resonator-skills",
   labels: { singular: "resonator-skill", plural: "resonator-skills" },
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
         name: "params",
         type: "json",
      },
      {
         name: "icon",
         type: "relationship",
         relationTo: "images",
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "resonator-skill-types",
      },
      {
         name: "max_lv",
         type: "number",
      },
      {
         name: "details",
         type: "array",
         fields: [
            {
               name: "name",
               type: "text",
            },
            {
               name: "values",
               type: "array",
               fields: [
                  {
                     name: "level",
                     type: "number",
                  },
                  {
                     name: "value",
                     type: "text",
                  },
               ],
            },
         ],
      },
      {
         name: "upgrade_costs",
         type: "array",
         fields: [
            {
               name: "lv",
               type: "number",
            },
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
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
