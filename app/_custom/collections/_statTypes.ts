import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const _StatTypes: CollectionConfig = {
   slug: "_statTypes",
   labels: { singular: "_statType", plural: "_statTypees" },
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
         name: "stat_id",
         type: "text",
      },
      {
         name: "data_key",
         type: "text",
      },
      {
         name: "property_classify",
         type: "number",
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
         name: "checksum",
         type: "text",
      },
   ],
};
