import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ConvenePools: CollectionConfig = {
   slug: "convene-pools",
   labels: { singular: "convene-pool", plural: "convene-pools" },
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
