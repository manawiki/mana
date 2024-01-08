import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const MaterialTypes: CollectionConfig = {
   slug: "materialTypes",
   labels: { singular: "materialType", plural: "materialTypes" },
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
