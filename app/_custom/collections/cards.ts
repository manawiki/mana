import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Cards: CollectionConfig = {
   slug: "cards",
   labels: { singular: "Card", plural: "Cards" },
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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "cardType",
         type: "select",
         options: [
            { label: "Pokémon", value: "pokemon" },
            { label: "Trainer", value: "trainer" },
         ],
      },
      // Trainer Cards
      {
         name: "trainerType",
         type: "select",
         options: [
            { label: "Supporter", value: "supporter" },
            { label: "Item", value: "item" },
            { label: "Fossil", value: "fossil" },
         ],
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "trainer",
         },
      },
      // Pokemon Cards
      {
         name: "hp",
         type: "number",
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "pokemonType",
         relationTo: "types",
         type: "relationship",
         hasMany: false,
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "weaknessType",
         relationTo: "types",
         type: "relationship",
         hasMany: false,
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "retreatCost",
         type: "number",
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "isEX",
         type: "checkbox",
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "moves",
         type: "relationship",
         relationTo: "moves",
         hasMany: true,
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
      },
      {
         name: "movesInfo",
         type: "array",
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
         fields: [
            {
               name: "move",
               type: "relationship",
               relationTo: "moves",
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
                     relationTo: "types",
                  },
                  {
                     name: "amount",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "abilities",
         type: "relationship",
         relationTo: "abilities",
         admin: {
            condition: (_, siblingData) => siblingData.cardType === "pokemon",
         },
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
