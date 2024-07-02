import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Talents: CollectionConfig = {
   slug: "talents",
   labels: { singular: "talent", plural: "talents" },
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
         name: "sort",
         type: "number",
      },
      {
         name: "desc",
         type: "textarea",
      },
      {
         name: "desc_flavor",
         type: "textarea",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
