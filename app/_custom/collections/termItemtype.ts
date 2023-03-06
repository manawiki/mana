import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const termItemtype: CollectionConfig = {
   slug: "termItemtype-lKJ16E5IhH",
   labels: { singular: "termItemtype", plural: "termItemtypes" },
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
