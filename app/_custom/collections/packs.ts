import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Packs: CollectionConfig = {
   slug: "packs",
   labels: { singular: "pack", plural: "packs" },
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
         name: "set",
         type: "relationship",
         relationTo: "sets",
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
               name: "rates",
               type: "array",
               fields: [
                  {
                     name: "slot",
                     type: "select",
                     options: [
                        { label: "1-3", value: "1-3" },
                        { label: "4", value: "4" },
                        { label: "5", value: "5" },
                     ],
                  },
                  {
                     name: "percent",
                     type: "number",
                  }
               ],
            }
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
