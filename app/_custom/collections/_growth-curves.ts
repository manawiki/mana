import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _GrowthCurves: CollectionConfig = {
   slug: "_growth-curves",
   labels: {
      singular: "_Growth-Curve",
      plural: "_Growth-Curves",
   },
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
         name: "checksum",
         type: "text",
      },
   ],
};
