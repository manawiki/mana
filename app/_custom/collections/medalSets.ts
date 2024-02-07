import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const MedalSets: CollectionConfig = {
   slug: "medalSets",
   labels: { singular: "medalSet", plural: "medalSets" },
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
         name: "desc",
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
