import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const BangbooTalents: CollectionConfig = {
   slug: "bangboo-talents",
   labels: { singular: "bangboo-talent", plural: "bangboo-talents" },
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
         name: "levels",
         type: "array",
         fields: [
            {
               name: "rank",
               type: "number",
            },
            {
               name: "desc",
               type: "textarea",
            },
            {
               name: "params",
               type: "array",
               fields: [
                  {
                     name: "title",
                     type: "text",
                  },
                  {
                     name: "params",
                     type: "json",
                  },
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
