import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
        name: "theme",
        type: "relationship",
        relationTo: "skinThemes",
      },
      {
        name: "desc",
        type: "text",
      },
      {
        name: "doll",
        type: "relationship",
        relationTo: "dolls",
      },
      {
        name: "npic",
        type: "upload",
        relationTo: "images",
      },
      {
        name: "lpic",
        type: "upload",
        relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
