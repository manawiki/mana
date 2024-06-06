import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Attributes: CollectionConfig = {
   slug: "attributes",
   labels: { singular: "attribute", plural: "attributes" },
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
         type: "relationship",
         relationTo: "images",
      },
      {
         name: "percent",
         type: "checkbox",
      },
      {
         name: "visible",
         type: "checkbox",
      },
      {
         name: "base",
         type: "relationship",
         relationTo: "attributes",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
