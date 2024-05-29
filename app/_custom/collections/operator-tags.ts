import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const OperatorTags: CollectionConfig = {
   slug: "operator-tags",
   labels: { singular: "operator-tag", plural: "operator-tags" },
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
