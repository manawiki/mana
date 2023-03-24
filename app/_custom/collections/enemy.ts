import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Enemy: CollectionConfig = {
   slug: "enemy-lKJ16E5IhH",
   labels: { singular: "enemy", plural: "enemies" },
   admin: { 
         group: "Custom",
         useAsTitle:  "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
         required: true,
         filterOptions: () => {
            return {
               collectionEntity: { equals: "enemy-lKJ16E5IhH" },
            };
         },
      },
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
         name: "hard_level_group",
         type: "number",
      },
      {
         name: "elite_group",
         type: "number",
      },
      {
         name: "rank",
         type: "text",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "skill_list",
         type: "relationship",
         relationTo: "enemySkill-lKJ16E5IhH",
         hasMany: true,
      },
      {
         name: "debuff_resist",
         type: "array",
         fields: [
            {
               name: "debuff",
               type: "relationship",
               relationTo: "_enemyStatusRes-lKJ16E5IhH",
               hasMany: false,
            },
            {
               name: "value",
               type: "number",
            },
         ],
      },
      {
         name: "elemental_weaknesses",
         type: "relationship",
         relationTo: "_element-lKJ16E5IhH",
         hasMany: true,
      },
      {
         name: "damage_resist",
         type: "array",
         fields: [
            {
               name: "element",
               type: "relationship",
               relationTo: "_element-lKJ16E5IhH",
               hasMany: false,
            },
            {
               name: "value",
               type: "number",
            },
         ],
      },
      {
         name: "stance_count",
         type: "number",
      },
      {
         name: "initial_delay_ratio",
         type: "number",
      },
      {
         name: "crit_damage_base",
         type: "number",
      },
      {
         name: "min_fatigue_ratio",
         type: "number",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "atk_base",
         type: "number",
      },
      {
         name: "def_base",
         type: "number",
      },
      {
         name: "hp_base",
         type: "number",
      },
      {
         name: "spd_base",
         type: "number",
      },
      {
         name: "stance_base",
         type: "number",
      },
      {
         name: "atk_ratio",
         type: "number",
      },
      {
         name: "def_ratio",
         type: "number",
      },
      {
         name: "hp_ratio",
         type: "number",
      },
      {
         name: "spd_ratio",
         type: "number",
      },
      {
         name: "stance_ratio",
         type: "number",
      },
      {
         name: "stats_csv",
         type: "text",
      },
      {
         name: "stats",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
