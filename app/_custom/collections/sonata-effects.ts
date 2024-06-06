import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const SonataEffects: CollectionConfig = {
   slug: "sonata-effects",
   labels: { singular: "sonata-effect", plural: "sonata-effects" },
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
         name: "slug",
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
         name: "color",
         type: "text",
      },
      {
         name: "effects",
         type: "array",
         fields: [
            {
               name: "pieces",
               type: "number",
            },
            {
               name: "effect",
               type: "text",
            },
            {
               name: "params",
               type: "json",
            },
         ],
      },
      {
         name: "echoes",
         type: "relationship",
         relationTo: "echoes",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
