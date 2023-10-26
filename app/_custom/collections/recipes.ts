import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Recipes: CollectionConfig = {
   slug: "recipes",
   labels: { singular: "Recipe", plural: "Recipes" },
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
         name: "icon_name",
         type: "text",
      },
      {
         name: "formula_type",
         type: "text",
      },
      {
         name: "coin_cost",
         type: "number",
      },
      {
         name: "order",
         type: "number",
      },
      {
         name: "world_level_require",
         type: "number",
      },
      {
         name: "max_count",
         type: "number",
      },
      {
         name: "recipe_type",
         type: "relationship",
         relationTo: "_recipeTypes",
         hasMany: false,
      },
      {
         name: "result_item",
         type: "relationship",
         relationTo: "materials",
         hasMany: false,
      },
      {
         name: "material_cost",
         type: "array",
         fields: [
            {
               name: "materials",
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
      {
         name: "special_material_cost",
         type: "relationship",
         relationTo: "materials",
         hasMany: true,
      },
      {
         name: "special_material_cost_num",
         type: "number",
      },
      {
         name: "relic_list",
         type: "relationship",
         relationTo: "relics",
         hasMany: true,
      },
      {
         name: "is_show_hold_num",
         type: "checkbox",
      },
      {
         name: "limit_type",
         type: "text",
      },
      {
         name: "func_type",
         type: "text",
      },
      {
         name: "item_compose_tag",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
