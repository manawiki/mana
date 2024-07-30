import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Quests: CollectionConfig = {
   slug: "quests",
   labels: { singular: "Quest", plural: "Quests" },
   admin: { group: "Custom", useAsTitle: "name" },

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
         name: "drupal_nid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "ap_cost",
         type: "number",
      },
      {
         name: "bond_points",
         type: "number",
      },
      {
         name: "qp",
         type: "number",
      },
      {
         name: "exp",
         type: "number",
      },
      {
         name: "order",
         type: "number",
      },
      {
         name: "main_quest_chapter",
         type: "relationship",
         relationTo: "_chapters",
         hasMany: false,
      },
      {
         name: "quest_type",
         type: "relationship",
         relationTo: "_quest-types",
         hasMany: false,
      },
      {
         name: "main_quest",
         type: "relationship",
         relationTo: "locations",
         hasMany: false,
      },
      {
         name: "quest_content",
         type: "array",
         fields: [
            {
               name: "text",
               type: "textarea",
            },
         ],
      },
      {
         name: "quest_details",
         type: "array",
         fields: [
            {
               name: "battle_stage",
               type: "select",
               hasMany: false,
               options: [
                  { value: "battle1-1", label: "Battle 1/1" },
                  { value: "battle1-2", label: "Battle 1/2" },
                  { value: "battle2-2", label: "Battle 2/2" },
                  { value: "battle1-3", label: "Battle 1/3" },
                  { value: "battle2-3", label: "Battle 2/3" },
                  { value: "battle3-3", label: "Battle 3/3" },
                  { value: "battle1-4", label: "Battle 1/4" },
                  { value: "battle2-4", label: "Battle 2/4" },
                  { value: "battle3-4", label: "Battle 3/4" },
                  { value: "battle4-4", label: "Battle 4/4" },
                  { value: "battle1-5", label: "Battle 1/5" },
                  { value: "battle2-5", label: "Battle 2/5" },
                  { value: "battle3-5", label: "Battle 3/5" },
                  { value: "battle4-5", label: "Battle 4/5" },
                  { value: "battle5-5", label: "Battle 5/5" },
                  { value: "battle1-6", label: "Battle 1/6" },
                  { value: "battle2-6", label: "Battle 2/6" },
                  { value: "battle3-6", label: "Battle 3/6" },
                  { value: "battle4-6", label: "Battle 4/6" },
                  { value: "battle5-6", label: "Battle 5/6" },
                  { value: "battle6-6", label: "Battle 6/6" },
                  { value: "fatal-battle1-1", label: "Fatal Battle 1/1" },
                  { value: "fatal-battle1-2", label: "Fatal Battle 1/2" },
                  { value: "fatal-battle2-2", label: "Fatal Battle 2/2" },
                  { value: "fatal-battle1-3", label: "Fatal Battle 1/3" },
                  { value: "fatal-battle2-3", label: "Fatal Battle 2/3" },
                  { value: "fatal-battle3-3", label: "Fatal Battle 3/3" },
                  { value: "fatal-battle1-4", label: "Fatal Battle 1/4" },
                  { value: "fatal-battle2-4", label: "Fatal Battle 2/4" },
                  { value: "fatal-battle3-4", label: "Fatal Battle 3/4" },
                  { value: "fatal-battle4-4", label: "Fatal Battle 4/4" },
                  { value: "fatal-battle5-5", label: "Fatal Battle 5/5" },
                  { value: "fatal-battle6-6", label: "Fatal Battle 6/6" },
                  { value: "fatal-battle1-7", label: "Fatal Battle 1/7" },
                  { value: "fatal-battle2-7", label: "Fatal Battle 2/7" },
                  { value: "fatal-battle3-7", label: "Fatal Battle 3/7" },
                  { value: "fatal-battle4-7", label: "Fatal Battle 4/7" },
                  { value: "fatal-battle5-7", label: "Fatal Battle 5/7" },
                  { value: "fatal-battle6-7", label: "Fatal Battle 6/7" },
                  { value: "fatal-battle7-7", label: "Fatal Battle 7/7" },
                  { value: "grand-battle1-1", label: "Grand Battle 1/1" },
                  { value: "sword-death1-1", label: "Sword, or Death 1/1" },
                  { value: "advent-beast", label: "ADVENT BEAST" },
                  { value: "slay-beast", label: "SLAY BEAST" },
                  { value: "childhoods-end", label: "Childhood's End" },
                  {
                     value: "tree-has-awakened",
                     label: "Tree Has Awakened 1/1",
                  },
                  { value: "starry-heavens1-1", label: "Starry Heavens 1/1" },
                  {
                     value: "evil-humanity-fetus1-1",
                     label: "Evil of Humanity (Fetus) 1/1",
                  },
               ],
            },
            {
               name: "quest_parts",
               type: "number",
            },
            {
               name: "guest_servants",
               type: "relationship",
               relationTo: "servants",
               hasMany: true,
            },
            {
               name: "enemy_details",
               type: "array",
               fields: [
                  {
                     name: "enemy",
                     type: "relationship",
                     relationTo: "enemies",
                     hasMany: false,
                  },
                  {
                     name: "level",
                     type: "number",
                  },
                  {
                     name: "hp",
                     type: "number",
                  },
                  {
                     name: "enemy_class",
                     type: "relationship",
                     relationTo: "_class-rarities",
                     hasMany: false,
                  },
                  {
                     name: "break_bars",
                     type: "relationship",
                     relationTo: "_break-bars",
                     hasMany: true,
                  },
                  {
                     name: "details",
                     type: "textarea",
                  },
                  {
                     name: "enemy_alternative",
                     type: "array",
                     fields: [
                        {
                           name: "enemy",
                           type: "relationship",
                           relationTo: "enemies",
                           hasMany: false,
                        },
                        {
                           name: "level",
                           type: "number",
                        },
                        {
                           name: "hp",
                           type: "number",
                        },
                        {
                           name: "enemy_class",
                           type: "relationship",
                           relationTo: "_class-rarities",
                           hasMany: false,
                        },
                        {
                           name: "break_bars",
                           type: "relationship",
                           relationTo: "_break-bars",
                           hasMany: true,
                        },
                        {
                           name: "details",
                           type: "textarea",
                        },
                     ],
                  },
               ],
            },
         ],
      },
      {
         name: "quest_drops",
         type: "array",
         fields: [
            {
               name: "mat",
               type: "relationship",
               relationTo: [
                  "materials",
                  "craft-essences",
                  "command-codes",
                  "servants",
               ],
               hasMany: false,
            },
            {
               name: "qty",
               type: "number",
            },
            {
               name: "percentage",
               type: "number",
            },
            {
               name: "other",
               type: "textarea",
            },
            {
               name: "max_number_drops",
               type: "number",
            },
         ],
      },
      {
         name: "quest_rewards",
         type: "array",
         fields: [
            {
               name: "mat",
               type: "relationship",
               relationTo: [
                  "materials",
                  "craft-essences",
                  "command-codes",
                  "servants",
               ],
               hasMany: false,
            },
            {
               name: "qty",
               type: "number",
            },
            {
               name: "percentage",
               type: "number",
            },
            {
               name: "other",
               type: "textarea",
            },
         ],
      },
      {
         name: "path",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
