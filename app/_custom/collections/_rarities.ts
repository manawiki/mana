import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _Rarities: CollectionConfig = {
   slug: "_rarities",
   labels: { singular: "_rarity", plural: "_rarities" },
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
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "data_key",
         type: "text",
      },
      {
         name: "display_number",
         type: "text",
      },
      {
         name: "color",
         type: "text",
      },
      {
         name: "color_line",
         type: "text",
      },
      {
         name: "image_frame_name",
         type: "text",
      },
      {
         name: "icon_frame_name",
         type: "text",
      },
      {
         name: "image_bg_name",
         type: "text",
      },
      {
         name: "image_frame",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_frame",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_bg",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
