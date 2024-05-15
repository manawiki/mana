import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Resonators: CollectionConfig = {
   slug: "resonators",
   labels: { singular: "resonator", plural: "resonators" },
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
         name: "nickname",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "intro",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "element",
         type: "relationship",
         relationTo: "elements",
      },
      {
         name: "weapon_type",
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
         ],
      },
      {
         name: "ascension_costs",
         type: "array",
         fields: [
            {
               name: "level",
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
            }
         ]
      },
      {
         name: "resonance_chain",
         type: "array",
         fields: [
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
            }
         ],
      },
      {
         name: "skill_tree",
         type: "relationship",
         relationTo: "resonator-skill-trees",
         hasMany: true,
      },
      {
         name: "birthday",
         type: "text",
      },
      {
         name: "gender",
         type: "text",
      },
      {
         name: "birthplace",
         type: "text",
      },
      {
         name: "affiliation",
         type: "text",
      },
      {
         name: "resonance_power",
         type: "text",
      },
      {
         name: "resonance_eval_report",
         type: "text",
      },
      {
         name: "overclock_diagnostic_report",
         type: "text",
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
         ],
      },
      {
         name: "quotes",
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
               name: "vo_cn",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_jp",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_en",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_kr",
               type: "upload",
               relationTo: "images",
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
