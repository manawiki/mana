import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const BangbooSkills: CollectionConfig = {
   slug: "bangboo-skills",
   labels: { singular: "bangboo-skill", plural: "bangboo-skills" },
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
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
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
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
