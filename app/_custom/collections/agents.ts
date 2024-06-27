import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Agents: CollectionConfig = {
   slug: "agents",
   labels: { singular: "agent", plural: "agents" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
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
         name: "data_key",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "name_code",
         type: "text",
      },
      {
         name: "name_full",
         type: "text",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "damage_type",
         type: "relationship",
         relationTo: "_damage-types",
         hasMany: true,
      },
      {
         name: "damage_element",
         type: "relationship",
         relationTo: "_damage-elements",
         hasMany: true,
      },
      {
         name: "character_camp",
         type: "relationship",
         relationTo: "_character-camps",
      },
      {
         name: "gender",
         type: "text",
      },
      {
         name: "weapon_type",
         type: "text",
      },
      {
         name: "hp",
         type: "number",
      },
      {
         name: "atk",
         type: "number",
      },
      {
         name: "def",
         type: "number",
      },
      {
         name: "hp_growth",
         type: "number",
      },
      {
         name: "atk_growth",
         type: "number",
      },
      {
         name: "def_growth",
         type: "number",
      },
      {
         name: "impact",
         type: "number",
      },
      {
         name: "crit",
         type: "number",
      },
      {
         name: "crit_damage",
         type: "number",
      },
      {
         name: "attribute_mastery",
         type: "number",
      },
      {
         label: "skills",
         type: "collapsible",
         fields: [
            {
               name: "skill_basic",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_dodge",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_special",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_chain",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_core",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_assist",
               type: "relationship",
               relationTo: "skills",
            },
         ],
      },
      {
         name: "talents",
         type: "relationship",
         relationTo: "talents",
         hasMany: true,
      },
      {
         name: "ascension_data",
         type: "array",
         fields: [
            {
               name: "asc",
               type: "number",
            },
            {
               name: "lv_min",
               type: "number",
            },
            {
               name: "lv_max",
               type: "number",
            },
            {
               name: "hp_adv",
               type: "number",
            },
            {
               name: "atk_adv",
               type: "number",
            },
            {
               name: "def_adv",
               type: "number",
            },
            {
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "icon_path",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_full_path",
         type: "text",
      },
      {
         name: "icon_full_name",
         type: "text",
      },
      {
         name: "icon_general_path",
         type: "text",
      },
      {
         name: "icon_general_name",
         type: "text",
      },
      {
         name: "icon_round_path",
         type: "text",
      },
      {
         name: "icon_round_name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_general",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_round",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "profile_info",
         type: "text",
      },
      {
         name: "profile_desc",
         type: "text",
      },
      {
         name: "height",
         type: "text",
      },
      {
         name: "bday",
         type: "text",
      },
      {
         name: "quotes",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "content",
               type: "text",
            },
            {
               name: "vo_zh",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_ja",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_en",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "vo_ko",
               type: "upload",
               relationTo: "images",
            },
         ],
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
