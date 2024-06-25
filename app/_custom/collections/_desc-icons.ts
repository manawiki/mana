import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
export const _DescIcons: CollectionConfig = {
   slug: "_desc-icons",
   labels: { singular: "_desc-icon", plural: "_desc-icons" },
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
         name: "size",
         type: "number",
      },
      {
         name: "icon_path",
         type: "text",
      },
      {
         name: "icon_name",
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
