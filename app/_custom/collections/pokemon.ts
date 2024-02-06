import type { CollectionConfig, FieldHook } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

interface CPMType {
   cpm: number;
}

type CPFieldHook = FieldHook & CPMType;

//@ts-ignore
//TODO Fix types
const levelCPHook: CPFieldHook = ({ value, data, operation }, cpm) => {
   if (operation == "create" || "update") {
      if (data?.baseAttack && data?.baseDefense && data?.baseStamina) {
         const atk = data?.baseAttack + 15;
         const def = data?.baseDefense + 15;
         const sta = data?.baseStamina + 15;
         const def1 = Math.pow(def, 0.5);
         const sta1 = Math.pow(sta, 0.5);
         const defSta = def1 * sta1 * cpm;
         const staAtk = defSta * atk;
         const result = Math.floor(staAtk / 10);
         return result;
      }
      return value;
   }

   return value;
};

export const Pokemon: CollectionConfig = {
   slug: "pokemon",
   labels: { singular: "Pokemon", plural: "Pokemon" },
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
         name: "number",
         type: "number",
      },
      {
         name: "baseAttack",
         type: "number",
      },
      {
         name: "baseDefense",
         type: "number",
      },
      {
         name: "baseStamina",
         type: "number",
      },
      {
         name: "level50CP",
         type: "number",
         hooks: {
            //@ts-ignore
            beforeValidate: [(args) => levelCPHook(args, 0.70610407319)],
         },
      },
      {
         name: "level40CP",
         type: "number",
         hooks: {
            //@ts-ignore
            beforeValidate: [(args) => levelCPHook(args, 0.624574105806)],
         },
      },
      {
         name: "level25CP",
         type: "number",
         hooks: {
            //@ts-ignore
            beforeValidate: [(args) => levelCPHook(args, 0.446135828356)],
         },
      },
      {
         name: "level20CP",
         type: "number",
         hooks: {
            //@ts-ignore
            beforeValidate: [(args) => levelCPHook(args, 0.356886771948)],
         },
      },
      {
         name: "level15CP",
         type: "number",
         hooks: {
            //@ts-ignore
            beforeValidate: [(args) => levelCPHook(args, 0.2676964994966)],
         },
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "types",
         hasMany: true,
      },
      {
         name: "region", //Manually do
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "Africa",
               value: "africa",
            },
            {
               label: "Africa (Daytime)",
               value: "africa_daytime",
            },
            {
               label: "Asia",
               value: "asia",
            },
            {
               label: "Australia",
               value: "australia",
            },
            {
               label: "Australia (Daytime)",
               value: "australia_daytime",
            },
            {
               label: "Between the 26th and 31st parallel",
               value: "between_26_31_parallel",
            },
            {
               label: "Eastern Asia",
               value: "eastern_asia",
            },
            {
               label: "Western Asia",
               value: "western_asia",
            },
            {
               label: "Europe",
               value: "europe",
            },
            {
               label: "Fiji",
               value: "fiji",
            },
            {
               label: "France",
               value: "france",
            },
            {
               label: "Vanuatu",
               value: "vanuatu",
            },
            {
               label: "New Caledonia",
               value: "new_caledonia",
            },
            {
               label: "New Zealand",
               value: "new_zealand",
            },
            {
               label: "North America",
               value: "north_america",
            },
            {
               label: "South America",
               value: "south_america",
            },
            {
               label: "New York and Surrounding Areas",
               value: "new_york_surrounding",
            },
         ],
      },
      {
         name: "specialEvolutionRequirements",
         type: "relationship",
         relationTo: "evolution-requirements",
         hasMany: false,
      },
      {
         name: "evolutionRequirements",
         type: "relationship",
         relationTo: "evolution-requirements",
         hasMany: false,
      },
      {
         name: "isShadow", //only checked on shadow form
         type: "checkbox",
      },
      {
         name: "shadowPokemon",
         type: "relationship",
         relationTo: "pokemon",
         hasMany: false,
      },
      {
         name: "isMega", //only on mega form
         type: "checkbox",
      },
      {
         name: "megaPokemon", //field_mega_evolutions_list array
         type: "relationship",
         relationTo: "pokemon",
         hasMany: true,
      },
      {
         name: "megaEnergyRequirements", //Mega Evolution Unlock + Mega Energy Cost
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "100 initial energy + 20 max subsequent energy",
               value: "_100_20",
            },
            {
               label: "200 initial energy + 40 max subsequent energy",
               value: "_200_40",
            },
            {
               label: "300 initial energy + 40 max subsequent energy",
               value: "_300_40",
            },
            {
               label: "300 initial energy + 60 max subsequent energy",
               value: "_300_60",
            },
            {
               label: "400 initial energy + 80 max subsequent energy",
               value: "_400_80",
            },
         ],
      },
      {
         name: "maleRate",
         type: "number",
      },
      {
         name: "femaleRate",
         type: "number",
         admin: {
            step: 0.01,
         },
      },
      {
         name: "weight",
         type: "number",
         admin: {
            step: 0.01,
         },
      },
      {
         name: "height",
         type: "number",
         admin: {
            step: 0.01,
         },
      },
      {
         name: "isNestingSpecie",
         type: "checkbox",
      },
      {
         name: "fleeRate",
         type: "number",
      },
      {
         name: "catchRate",
         type: "number",
      },
      {
         label: "Images",
         type: "collapsible",
         fields: [
            {
               name: "icon",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "images",
               type: "group",
               fields: [
                  {
                     name: "florkImage",
                     type: "upload",
                     relationTo: "images",
                  },
                  {
                     name: "goImage",
                     type: "upload",
                     relationTo: "images",
                  },
                  {
                     name: "goShinyImage",
                     type: "upload",
                     relationTo: "images",
                  },
                  {
                     name: "shuffleImage",
                     type: "upload",
                     relationTo: "images",
                  },
               ],
            },
         ],
      },
      {
         label: "Moves",
         type: "collapsible",
         fields: [
            {
               name: "fastMoves",
               type: "array",
               fields: [
                  {
                     name: "move",
                     type: "relationship",
                     relationTo: "moves",
                     hasMany: false,
                  },
                  {
                     name: "category",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
                     },
                     options: [
                        {
                           label: "Elite",
                           value: "elite",
                        },
                        {
                           label: "Exclusive",
                           value: "exclusive",
                        },
                        {
                           label: "Legacy",
                           value: "legacy",
                        },
                        {
                           label: "Purified",
                           value: "purified",
                        },
                     ],
                  },
               ],
            },
            {
               name: "chargeMoves",
               type: "array",
               fields: [
                  {
                     name: "move",
                     type: "relationship",
                     relationTo: "moves",
                     hasMany: false,
                  },
                  {
                     name: "category",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
                     },
                     options: [
                        {
                           label: "Elite",
                           value: "elite",
                        },
                        {
                           label: "Exclusive",
                           value: "exclusive",
                        },
                        {
                           label: "Legacy",
                           value: "legacy",
                        },
                        {
                           label: "Purified",
                           value: "purified",
                        },
                     ],
                  },
               ],
            },
         ],
      },
      {
         label: "Ratings",
         type: "collapsible",
         fields: [
            {
               name: "ratings",
               type: "group",
               fields: [
                  {
                     name: "attackerRating",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                     },
                     options: [
                        {
                           label: "S",
                           value: "s",
                        },
                        {
                           label: "A+",
                           value: "a_plus",
                        },
                        {
                           label: "A",
                           value: "a",
                        },
                        {
                           label: "B+",
                           value: "b_plus",
                        },
                        {
                           label: "B",
                           value: "b",
                        },
                        {
                           label: "C",
                           value: "c",
                        },
                     ],
                  },
                  {
                     name: "greatLeagueRating",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                     },
                     options: [
                        {
                           label: "1",
                           value: "_1_0",
                        },
                        {
                           label: "1.5",
                           value: "_1_5",
                        },
                        {
                           label: "2",
                           value: "_2_0",
                        },
                        {
                           label: "2.5",
                           value: "_2_5",
                        },
                        {
                           label: "3",
                           value: "_3_0",
                        },
                        {
                           label: "3.5",
                           value: "_3_5",
                        },
                        {
                           label: "4",
                           value: "_4_0",
                        },
                        {
                           label: "4.5",
                           value: "_4_5",
                        },
                        {
                           label: "5",
                           value: "_5_0",
                        },
                     ],
                  },
                  {
                     name: "ultraLeagueRating",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                     },
                     options: [
                        {
                           label: "1",
                           value: "_1_0",
                        },
                        {
                           label: "1.5",
                           value: "_1_5",
                        },
                        {
                           label: "2",
                           value: "_2_0",
                        },
                        {
                           label: "2.5",
                           value: "_2_5",
                        },
                        {
                           label: "3",
                           value: "_3_0",
                        },
                        {
                           label: "3.5",
                           value: "_3_5",
                        },
                        {
                           label: "4",
                           value: "_4_0",
                        },
                        {
                           label: "4.5",
                           value: "_4_5",
                        },
                        {
                           label: "5",
                           value: "_5_0",
                        },
                     ],
                  },
                  {
                     name: "masterLeagueRating",
                     type: "select",
                     hasMany: false,
                     admin: {
                        isClearable: true,
                     },
                     options: [
                        {
                           label: "1",
                           value: "_1_0",
                        },
                        {
                           label: "1.5",
                           value: "_1_5",
                        },
                        {
                           label: "2",
                           value: "_2_0",
                        },
                        {
                           label: "2.5",
                           value: "_2_5",
                        },
                        {
                           label: "3",
                           value: "_3_0",
                        },
                        {
                           label: "3.5",
                           value: "_3_5",
                        },
                        {
                           label: "4",
                           value: "_4_0",
                        },
                        {
                           label: "4.5",
                           value: "_4_5",
                        },
                        {
                           label: "5",
                           value: "_5_0",
                        },
                     ],
                  },
               ],
            },
         ],
      },
      {
         name: "raidBossTier",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "1",
               value: "_1",
            },
            {
               label: "2",
               value: "_2",
            },
            {
               label: "3",
               value: "_3",
            },
            {
               label: "4",
               value: "_4",
            },
            {
               label: "5",
               value: "_5",
            },
            {
               label: "6",
               value: "_6",
            },
            {
               label: "Elite",
               value: "elite",
            },
            {
               label: "Legendary Mega",
               value: "legendary_Mega",
            },
            {
               label: "Mega",
               value: "mega",
            },
         ],
      },
      {
         name: "secondChargeMoveCost",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "120,000 Stardust + 120 Candy",
               value: "_120_120",
            },
            {
               label: "100,000 Stardust + 100 Candy",
               value: "_100_100",
            },
            {
               label: "90,000 Stardust + 90 Candy",
               value: "_90_90",
            },
            {
               label: "75,000 Stardust + 75 Candy",
               value: "_75_75",
            },
            {
               label: "75,000 Stardust + 50 Candy",
               value: "_75_50",
            },
            {
               label: "60,000 Stardust + 60 Candy",
               value: "_60_60",
            },
            {
               label: "50,000 Stardust + 50 Candy",
               value: "_50_50",
            },
            {
               label: "12,000 Stardust + 30 Candy",
               value: "_12_30",
            },
            {
               label: "10,000 Stardust + 25 Candy",
               value: "_10_25",
            },
         ],
      },
      {
         name: "buddyDistance",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "1 KM",
               value: "_1",
            },
            {
               label: "3 KM",
               value: "_3",
            },
            {
               label: "5 KM",
               value: "_5",
            },
            {
               label: "20 KM",
               value: "_20",
            },
         ],
      },
      {
         name: "hatchDistance",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "2 KM",
               value: "_2",
            },
            {
               label: "5 KM",
               value: "_5",
            },
            {
               label: "7 KM",
               value: "_7",
            },
            {
               label: "10 KM",
               value: "_10",
            },
            {
               label: "20 KM",
               value: "_20",
            },
         ],
      },
      {
         name: "purificationCost",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "1 Candy + 1,000 Stardust",
               value: "_1_1",
            },
            {
               label: "3 Candy + 3,000 Stardust",
               value: "_3_3",
            },
            {
               label: "5 Candy + 5,000 Stardust",
               value: "_5_5",
            },
            {
               label: "20 Candy + 20,000 Stardust",
               value: "_20_20",
            },
         ],
      },
      {
         name: "shinyAcquireMethod",
         type: "select",
         hasMany: true,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "Eggs",
               value: "eggs",
            },
            {
               label: "Evolution",
               value: "evolution",
            },
            {
               label: "Mega Evolution",
               value: "mega_evolution",
            },
            {
               label: "Mystery Box (Main Series Transfer)",
               value: "mystery_box_main_series_transfer",
            },
            {
               label: "Raids",
               value: "raids",
            },
            {
               label: "Research Encounter",
               value: "research_encounter",
            },
            {
               label: "Rocket Grunts",
               value: "rocket_grunts",
            },
            {
               label: "Rocket Leader Battles",
               value: "rocket_leader_battles",
            },
            {
               label: "Wild",
               value: "wild",
            },
         ],
      },
      {
         name: "generation",
         type: "select",
         hasMany: false,
         admin: {
            isClearable: true,
         },
         options: [
            {
               label: "1",
               value: "_1",
            },
            {
               label: "2",
               value: "_2",
            },
            {
               label: "3",
               value: "_3",
            },
            {
               label: "4",
               value: "_4",
            },
            {
               label: "5",
               value: "_5",
            },
            {
               label: "6",
               value: "_6",
            },
            {
               label: "7",
               value: "_7",
            },
            {
               label: "8",
               value: "_8",
            },
            {
               label: "9",
               value: "_9",
            },
         ],
      },
   ],
};
