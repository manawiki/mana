import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _Chapters: CollectionConfig = {
   slug: "_chapters",
   labels: { singular: "_Chapter", plural: "_Chapters" },
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
         name: "type",
         type: "relationship",
         relationTo: "_quest-types",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
