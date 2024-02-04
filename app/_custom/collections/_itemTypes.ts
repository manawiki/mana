import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _ItemTypes: CollectionConfig = {
   slug: "_itemTypes",
   labels: { singular: "_itemType", plural: "_itemTypes" },
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
         name: "inv_type",
         type: "text",
      },
      {
         name: "sort_weight",
         type: "number",
      },
      {
         name: "type_categories",
         type: "json",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
