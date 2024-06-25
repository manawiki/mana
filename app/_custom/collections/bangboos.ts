import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
export const Bangboos: CollectionConfig = {
   slug: "bangboos",
   labels: { singular: "bangboo", plural: "bangboos" },
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
         name: "name_en",
         type: "text",
      },
      {
         name: "desc",
         type: "textarea",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "hp",
         type: "number",
      },
      {
         name: "hp_growth",
         type: "number",
      },
      {
         name: "atk",
         type: "number",
      },
      {
         name: "atk_growth",
         type: "number",
      },
      {
         name: "def",
         type: "number",
      },
      {
         name: "def_growth",
         type: "number",
      },
      {
         name: "impact",
         type: "number",
      },
      {
         name: "attribute_mastery",
         type: "number",
      },
      {
         name: "crit",
         type: "number",
      },
      {
         name: "skills",
         type: "relationship",
         relationTo: "bangboo-skills",
         hasMany: true,
      },
      {
         name: "talents",
         type: "relationship",
         relationTo: "bangboo-talents",
         hasMany: true,
      },
      {
         name: "ascension_data",
         type: "array",
         fields: [
            {
               name: "asc",
               type: "number",
            },
            {
               name: "lv_min",
               type: "number",
            },
            {
               name: "lv_max",
               type: "number",
            },
            {
               name: "hp_adv",
               type: "number",
            },
            {
               name: "atk_adv",
               type: "number",
            },
            {
               name: "def_adv",
               type: "number",
            },
            {
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ],
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_full_name",
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
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
