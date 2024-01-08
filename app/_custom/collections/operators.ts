import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Operators: CollectionConfig = {
   slug: "operators",
   labels: { singular: "operator", plural: "operators" },
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
         name: "name_cn",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
        name: "display_no",
        type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
        name: "position",
        type: "relationship",
        relationTo: "positions",
      },
      {
        name: "profession",
        type: "relationship",
        relationTo: "professions",
      },
      {
        name: "sub_profession",
        type: "relationship",
        relationTo: "professions",
      },
      {
        name: "nation",
        type: "relationship",
        relationTo: "factions",
      },
      {
        name: "group",
        type: "relationship",
        relationTo: "factions",
      },
      {
        name: "team",
        type: "relationship",
        relationTo: "factions",
      },
      {
         name: "obtainable",
         type: "checkbox",
       },
       {
          name: "obtain",
          type: "text",
       },
       {
         name: "potential_item",
         type: "relationship",
         relationTo: "materials",
       },
       {
         name: "tags",
         type: "relationship",
         relationTo: "operatorTags",
         hasMany: true,
       },
       {
         name: "availability",
         type: "select",
         hasMany: true,
         options: [
            { label: "CN", value: "cn" },
            { label: "NA", value: "na" },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
