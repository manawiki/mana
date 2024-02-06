import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Weather: CollectionConfig = {
   slug: "weather",
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
         name: "name",
         type: "text",
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "boostedTypes",
         type: "relationship",
         relationTo: "types",
         hasMany: true,
      },
   ],
};
