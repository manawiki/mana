import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Thropies: CollectionConfig = {
   slug: "thropies",
   labels: { singular: "thropy", plural: "thropies" },
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
      // {
      //    name: "next",
      //    type: "relationship",
      //    relationTo: "achievements",
      // },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
