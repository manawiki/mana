import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Achievement: CollectionConfig = {
   slug: "achievement-lKJ16E5IhH",
   labels: { singular: "achievement", plural: "achievements" },
   admin: { 
         group: "Custom",
         useAsTitle:  "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
         required: true,
         filterOptions: () => {
            return {
               collectionEntity: { equals: "achievement-lKJ16E5IhH" },
            };
         },
      },
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
         name: "description",
         type: "text",
      },
      {
         name: "achievement_series",
         type: "relationship",
         relationTo: "termAchievementseries-lKJ16E5IhH",
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
