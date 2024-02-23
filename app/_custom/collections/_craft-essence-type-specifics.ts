import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _CraftEssenceTypeSpecifics: CollectionConfig = {
   slug: "_craft-essence-type-specifics",
   labels: {
      singular: "_Craft-Essence-Type-Specific",
      plural: "_Craft-Essence-Type-Specifics",
   },
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
         name: "drupal_tid",
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
         name: "ce_With_Effect",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "cc_With_Effect",
         type: "relationship",
         relationTo: "command-codes",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
