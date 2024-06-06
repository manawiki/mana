import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const CookingRecipes: CollectionConfig = {
   slug: "cooking-recipes",
   labels: { singular: "cooking-recipe", plural: "cooking-recipes" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "recipe_item",
         type: "relationship",
         relationTo: "items",
      },
      {
         name: "result_item",
         type: "relationship",
         relationTo: "items",
      },
      {
         name: "cooking_items",
         type: "array",
         fields: [
            {
               name: "item",
               type: "relationship",
               relationTo: "items",
            },
            {
               name: "cnt",
               type: "number",
            },
         ],
      },
      {
         name: "special_dishes",
         type: "array",
         fields: [
            {
               name: "resonator",
               type: "relationship",
               relationTo: "resonators",
            },
            {
               name: "item",
               type: "relationship",
               relationTo: "items",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
