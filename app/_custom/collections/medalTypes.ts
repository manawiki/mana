import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const MedalTypes: CollectionConfig = {
   slug: "medalTypes",
   labels: { singular: "medalType", plural: "medalTypes" },
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
         name: "sort_id",
         type: "number",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
