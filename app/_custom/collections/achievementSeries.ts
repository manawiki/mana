import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const AchievementSeries: CollectionConfig = {
   slug: "achievementSeries",
   labels: { singular: "achievementSeries", plural: "achievementSerieses" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "data_key",
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_small_name",
         type: "text",
      },
      {
         name: "icon_small",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
