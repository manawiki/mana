import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Moves: CollectionConfig = {
   slug: "moves",
   labels: { singular: "Move", plural: "Moves" },
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
         name: "desc",
         type: "text",
      },
      {
         name: "isDamaging",
         type: "checkbox",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
