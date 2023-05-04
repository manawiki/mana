import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Aeons: CollectionConfig = {
   slug: "aeons",
   labels: { singular: "Aeon", plural: "Aeons" },
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
         name: "rogue_version",
         type: "text",
      },
      {
         name: "sort",
         type: "text",
      },
      {
         name: "subtitle",
         type: "text",
      },
      {
         name: "path_name",
         type: "text",
      },
      {
         name: "effect_1",
         type: "text",
      },
      {
         name: "effect_2",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_small_name",
         type: "text",
      },
      {
         name: "icon_class_name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_small",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_class",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
      
   ],
};
