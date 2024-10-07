import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Sets: CollectionConfig = {
   slug: "sets",
   labels: { singular: "Set", plural: "Sets" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "logo",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "packs",
         type: "relationship",
         relationTo: "packs",
         hasMany: true,
      },
      {
         name: "cards",
         type: "relationship",
         relationTo: "cards",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
