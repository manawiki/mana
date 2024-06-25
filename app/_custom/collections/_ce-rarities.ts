import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const _CeRarities: CollectionConfig = {
   slug: "_ce-rarities",
   labels: { singular: "_ce-Rarity", plural: "_ce-Rarities" },
   admin: {
      group: "Custom",
      useAsTitle: "display_number",
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
         name: "display_number",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
