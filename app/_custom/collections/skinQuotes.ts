import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const SkinQuotes: CollectionConfig = {
   slug: "skinQuotes",
   labels: { singular: "skinQuote", plural: "skinQuotes" },
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
         name: "title",
         type: "text",
      },
      {
         name: "text",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
