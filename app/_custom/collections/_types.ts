import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Types: CollectionConfig = {
   slug: "types",
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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "boostedWeather",
         type: "relationship",
         relationTo: "weather",
         hasMany: false,
      },
   ],
};
