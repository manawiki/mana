import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Skills: CollectionConfig = {
   slug: "skills",
   labels: { singular: "skill", plural: "skills" },
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
      }
   ],
};
