import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const SynthesisRecipes: CollectionConfig = {
   slug: "synthesis-recipes",
   labels: { singular: "synthesis-recipe", plural: "synthesis-recipes" },
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
         name: "synthesis_items",
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
