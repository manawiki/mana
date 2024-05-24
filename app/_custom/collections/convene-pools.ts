import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ConveneTypes: CollectionConfig = {
   slug: "convene-types",
   labels: { singular: "convene-type", plural: "convene-types" },
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
         name: "img",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "resource_id",
         type: "text"
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
