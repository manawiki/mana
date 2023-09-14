import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Achievements: CollectionConfig = {
   slug: "achievements",
   labels: { singular: "achievement", plural: "achievements" },
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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "category",
         type: "relationship",
         relationTo: "achievementCategories",
      },
      {
         name: "order",
         type: "number",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "rewards",
         type: "array",
         fields: [
            {
               name: "item",
               type: "relationship",
               relationTo: "items",
            },
            {
               name: "qty",
               type: "number",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
