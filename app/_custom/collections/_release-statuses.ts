import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _ReleaseStatuses: CollectionConfig = {
   slug: "_release-statuses",
   labels: { singular: "_release-Status", plural: "_release-Statuses" },
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
