import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _Elements: CollectionConfig = {
   slug: "_elements",
   labels: { singular: "_element", plural: "_elements" },
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_color_name",
         type: "text",
      },
      {
         name: "icon_active_name",
         type: "text",
      },
      {
         name: "icon_inactive_name",
         type: "text",
      },
      {
         name: "icon_damage_res_name",
         type: "text",
      },
      {
         name: "icon_color",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_active",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_inactive",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_damage_res",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
