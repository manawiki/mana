import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const AchievementSubGroups: CollectionConfig = {
   slug: "achievement-subgroups",
   labels: { singular: "achievement-subgroup", plural: "achievement-subgroups" },
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
         name: "group",
         type: "relationship",
         relationTo: "achievement-groups",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
