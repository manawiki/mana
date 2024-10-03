import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const PokemonAttacks: CollectionConfig = {
   slug: "pokemon-attacks",
   labels: { singular: "pokemon-attack", plural: "pokemon-attacks" },
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
         name: "name",
         type: "text",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "is_damaging",
         type: "checkbox",
      },
      {
         name: "damage",
         type: "number",
      },
      {
         name: "cost",
         type: "array",
         fields: [
            {
               name: "type",
               type: "relationship",
               relationTo: "pokemon-types",
            },
            {
               name: "amount",
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
