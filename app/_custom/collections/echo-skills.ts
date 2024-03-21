import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const EchoSkills: CollectionConfig = {
   slug: "echo-skills",
   labels: { singular: "echo-skill", plural: "echo-skills" },
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
         name: "desc",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "cd",
         type: "number",
      },
      {
         name: "params",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
