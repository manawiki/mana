import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Enemies: CollectionConfig = {
   slug: "enemies",
   labels: { singular: "enemy", plural: "enemies" },
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
         name: "atlas_sort",
         type: "text",
      },
      {
         name: "camp",
         type: "relationship",
         relationTo: "_enemyCamps",
         hasMany: false,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "enemy_variations",
         type: "relationship",
         relationTo: "enemyVariations",
         hasMany: true,
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "image_full_name",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
