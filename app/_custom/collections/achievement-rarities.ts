import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const AchievementRarities: CollectionConfig = {
   slug: "achievement-rarities",
   labels: { singular: "achievement-rarity", plural: "achievement-rarities" },
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
         type: "relationship",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
