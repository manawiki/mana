import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Sets: CollectionConfig = {
   slug: "sets",
   labels: { singular: "set", plural: "sets" },
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
         name: "logo",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "cards",
         type: "array",
         fields: [
            {
               name: "card",
               type: "relationship",
               relationTo: "cards",
            },
            {
               name: "number",
               type: "number",
            },
         ]
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
