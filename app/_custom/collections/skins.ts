import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Skins: CollectionConfig = {
   slug: "skins",
   labels: { singular: "skin", plural: "skins" },
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
         name: "operator",
         type: "relationship",
         relationTo: "operators",
      },
      {
         name: "brand",
         type: "relationship",
         relationTo: "skin-brands",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "dialog",
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
         name: "quotes",
         type: "relationship",
         relationTo: "skin-quotes",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
