import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const PokemonCards: CollectionConfig = {
   slug: "pokemon-cards",
   labels: { singular: "pokemon-card", plural: "pokemon-cards" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "text"
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "hp",
         type: "number",
      },
      {
         name: "type",
         relationTo: "pokemon-types",
         type: "relationship",
      },
      {
         name: "weakness_type",
         relationTo: "pokemon-types",
         type: "relationship",
      },
      {
         name: "retreat_cost",
         type: "number",
      },
      {
         name: "is_ex",
         type: "checkbox",
      },
      {
         name: "attacks",
         type: "relationship",
         relationTo: "pokemon-attacks",
      },
      {
         name: "abilities",
         type: "relationship",
         relationTo: "pokemon-abilities",
      },
      {
         name: "illustrators",
         type: "relationship",
         relationTo: "illustrators",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
