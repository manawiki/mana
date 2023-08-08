import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Blessings: CollectionConfig = {
   slug: "blessings",
   labels: { singular: "Blessing", plural: "Blessings" },
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
         hasMany: false,
      },
      {
         name: "aeon",
         type: "relationship",
         relationTo: "aeons",
         hasMany: false,
      },
      {
         name: "is_show",
         type: "checkbox",
      },
      {
         name: "buff_tag",
         type: "text",
      },
      {
         name: "max_level",
         type: "number",
      },
      {
         name: "effects",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "description",
               type: "text",
            },
            {
               name: "description_simple",
               type: "text",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
