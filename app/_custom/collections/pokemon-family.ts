import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const PokemonFamilies: CollectionConfig = {
   slug: "pokemon-families",
   labels: { singular: "Family", plural: "Families" },
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
         name: "pokemonInFamily",
         type: "relationship",
         relationTo: "pokemon",
         hasMany: true,
      },
      {
         name: "basePokemon",
         type: "relationship",
         relationTo: "pokemon",
         hasMany: false,
      },
      {
         name: "stage2Pokemon",
         type: "array",
         fields: [
            {
               name: "pokemon",
               type: "relationship",
               relationTo: "pokemon",
               hasMany: false,
            },
            {
               name: "evolutionRequirements",
               type: "relationship",
               relationTo: "evolution-requirements",
               hasMany: true,
            },
         ],
      },
      {
         name: "stage3Pokemon",
         type: "array",
         fields: [
            {
               name: "pokemon",
               type: "relationship",
               relationTo: "pokemon",
               hasMany: false,
            },
            {
               name: "evolutionRequirements",
               type: "relationship",
               relationTo: "evolution-requirements",
               hasMany: true,
            },
         ],
      },
      {
         name: "stage4Pokemon",
         type: "array",
         fields: [
            {
               name: "pokemon",
               type: "relationship",
               relationTo: "pokemon",
               hasMany: false,
            },
            {
               name: "evolutionRequirements",
               type: "relationship",
               relationTo: "evolution-requirements",
               hasMany: true,
            },
         ],
      },
   ],
};
