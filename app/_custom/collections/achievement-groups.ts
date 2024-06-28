import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const AchievementGroups: CollectionConfig = {
   slug: "achievement-groups",
   labels: { singular: "achievement-group", plural: "achievement-groups" },
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
