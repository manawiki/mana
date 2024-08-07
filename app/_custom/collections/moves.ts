import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
import { movesBeforeChangeHook } from "../hooks/move-hooks";
import {
   afterDeleteSearchSyncHook,
   afterChangeSearchSyncHook,
} from "../hooks/search-hooks";

export const Moves: CollectionConfig = {
   slug: "moves",
   labels: { singular: "Move", plural: "Moves" },
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
   hooks: {
      afterDelete: [afterDeleteSearchSyncHook],
      afterChange: [afterChangeSearchSyncHook],
      beforeChange: [movesBeforeChangeHook],
   },
   fields: [
      {
         name: "name",
         type: "text",
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "types",
         hasMany: false,
      },
      {
         name: "pokemonWithMove",
         type: "relationship",
         relationTo: "pokemon",
         hasMany: true,
      },
      {
         name: "category",
         type: "select",
         required: true,
         hasMany: false,
         options: [
            {
               label: "Fast",
               value: "fast",
            },
            {
               label: "Charge",
               value: "charge",
            },
         ],
      },
      {
         name: "pve",
         type: "group",
         fields: [
            {
               name: "power", //Move Damage
               type: "number",
            },
            {
               name: "duration",
               label: "Duration (Seconds)", //Move Duration Ms
               type: "number",
            },
            {
               name: "damagePerSecond",
               type: "number",
            },
            {
               name: "damagePerEnergy",
               type: "number",
            },
            {
               name: "energyPerSecond",
               type: "number",
            },
            {
               name: "damageWindowStart", //Damage Window Start
               type: "number",
            },
            {
               name: "damageWindowEnd", //Damage Window End
               type: "number",
            },
            {
               name: "dodgeWindow",
               type: "number",
            },
            {
               name: "energyDeltaFast", //Energy Delta Quick
               type: "number",
            },
            {
               name: "damagePerEnergyDamagePerSecond",
               type: "number",
            },
            {
               name: "energyDeltaCharge", //Combine Move Energy Requirements with Energy Delta CHARGE
               type: "select",
               hasMany: false,
               options: [
                  {
                     label: "1 Bar",
                     value: "100",
                  },
                  {
                     label: "2 Bar",
                     value: "50",
                  },
                  {
                     label: "3 Bar",
                     value: "33",
                  },
                  {
                     label: "4 Bar",
                     value: "25",
                  },
                  {
                     label: "5 Bar",
                     value: "20",
                  },
               ],
            },
         ],
      },
      {
         name: "pvp",
         type: "group",
         fields: [
            {
               name: "power", //PvP Power - Fast
               type: "number",
            },
            {
               name: "damagePerEnergy",
               type: "number",
            },
            {
               name: "energyDeltaFast", //PvP Energy Delta - Fast
               type: "number",
            },
            {
               name: "energyDeltaCharge", //PvP Charge Energy
               type: "number",
            },
            {
               name: "secondDurationFast", //PvP Duration in Seconds - Fast
               type: "number",
            },
            {
               name: "turnDurationFast", //PvP Duration Turns - Fast
               type: "number",
            },
         ],
      },
      {
         name: "probability", //Probability
         type: "number",
      },
      {
         name: "stageDelta", //Stage Delta
         type: "number",
      },
      {
         name: "stageMax", //Stage Delta Max
         type: "number",
      },
      {
         name: "stat",
         type: "select",
         hasMany: true,
         options: [
            {
               label: "Attack",
               value: "atk",
            },
            {
               label: "Defense",
               value: "def",
            },
         ],
      },
      {
         name: "subject",
         type: "select",
         hasMany: false,
         options: [
            {
               label: "Self",
               value: "self",
            },
            {
               label: "Opponent",
               value: "opponent",
            },
         ],
      },
   ],
};
