import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Materials: CollectionConfig = {
   slug: "materials",
   labels: { singular: "Material", plural: "Materials" },
   admin: { group: "Custom", useAsTitle: "name" },

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
         name: "drupal_nid",
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
         name: "icon_transparent",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "path",
         type: "text",
      },
      {
         name: "_item_Type",
         type: "relationship",
         relationTo: "_item-types",
         hasMany: false,
         required: false,
      },
      {
         name: "_rarity",
         type: "relationship",
         relationTo: "_rarities",
         hasMany: false,
         required: false,
      },
      {
         name: "_release_Status",
         type: "relationship",
         relationTo: "_release-statuses",
         hasMany: false,
         required: false,
      },
      {
         name: "best_drop_locations",
         type: "array",
         fields: [
            {
               name: "ap_per_drop",
               type: "number",
            },
            {
               name: "quest_dropped_from",
               type: "relationship",
               relationTo: "quests",
               hasMany: false,
            },
         ],
      },
      {
         name: "ce_With_Drop_Bonus",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
         admin: {
            readOnly: true,
         },
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
