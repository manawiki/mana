import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Materials: CollectionConfig = {
   slug: "materials",
   labels: { singular: "material", plural: "materials" },
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
         relationTo: "materialTypes",
      },
      {
         name: "sort_id",
         type: "number",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "usage",
         type: "text",
      },
      {
         name: "obtain",
         type: "text",
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
