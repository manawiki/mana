import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Achievements: CollectionConfig = {
   slug: "achievements",
   labels: { singular: "achievement", plural: "achievements" },
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
         name: "description",
         type: "text",
      },
      {
         name: "achievement_series",
         type: "relationship",
         relationTo: "achievementSeries",
         hasMany: false,
      },
      {
         name: "rarity",
         type: "text",
      },
      {
         name: "priority",
         type: "number",
      },
      {
         name: "show_type",
         type: "text",
      },
      {
         name: "quest",
         type: "text",
      },
      {
         name: "linear_quest",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
