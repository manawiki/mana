import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
export const _DamageElements: CollectionConfig = {
   slug: "_damage-elements",
   labels: { singular: "_damage-element", plural: "_damage-elements" },
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
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "hp_revise",
         type: "number",
      },
      {
         name: "armor_revise",
         type: "number",
      },
      {
         name: "shield_revise",
         type: "number",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
