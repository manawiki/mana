import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const DataJsons: CollectionConfig = {
   slug: "data-jsons",
   labels: { singular: "data-json", plural: "data-jsons" },
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
         name: "json",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
