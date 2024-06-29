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
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "comment",
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
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "specialty",
         type: "relationship",
         relationTo: "specialties",
      },
      {
         name: "stat_primary",
         type: "group",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "_stats",
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
               name: "stat",
               type: "relationship",
               relationTo: "_stats",
            },
            {
               name: "value",
               type: "text",
            },
            {
               name: "pct",
               type: "checkbox",
            }
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
         name: "checksum",
         type: "text",
      },
   ],
};
