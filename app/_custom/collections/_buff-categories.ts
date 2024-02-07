import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _BuffCategories: CollectionConfig = {
   slug: "_buff-categories",
   labels: { singular: "_Buff-Category", plural: "_Buff-Categories" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "drupal_tid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "_status_effects",
         type: "relationship",
         relationTo: "_status-effects",
         hasMany: true,
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
