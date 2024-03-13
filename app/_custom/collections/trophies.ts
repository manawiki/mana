import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Trophies: CollectionConfig = {
   slug: "trophies",
   labels: { singular: "trophy", plural: "trophies" },
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
         name: "group",
         type: "relationship",
         relationTo: "thropyGroups",
      },
      {
         name: "next",
         type: "relationship",
         relationTo: "trophies",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
