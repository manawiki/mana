import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
export const WEngines: CollectionConfig = {
   slug: "w-engines",
   labels: { singular: "w-engine", plural: "w-engines" },
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
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "stat_primary",
         type: "group",
         fields: [
            {
               name: "name",
               type: "text",
            },
            {
               name: "value",
               type: "text",
            },
         ],
      },
      {
         name: "stat_secondary",
         type: "group",
         fields: [
            {
               name: "name",
               type: "text",
            },
            {
               name: "value",
               type: "text",
            },
         ],
      },
      {
         name: "talent_title",
         type: "text",
      },
      {
         name: "talent",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "desc",
               type: "textarea",
            },
         ],
      },
      {
         name: "icon_path",
         type: "text",
      },
      {
         name: "icon_full_path",
         type: "text",
      },
      {
         name: "icon_big_path",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_full_name",
         type: "text",
      },
      {
         name: "icon_big_name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_big",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
