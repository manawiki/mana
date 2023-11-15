import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Characters: CollectionConfig = {
   slug: "characters",
   labels: { singular: "character", plural: "characters" },
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
         name: "eng_name",
         type: "text",
      },
      {
         name: "profession",
         type: "relationship",
         relationTo: "_professions",
      },
      {
         name: "weapon_type",
         type: "relationship",
         relationTo: "_weapon-types",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "energy_shard_type",
         type: "relationship",
         relationTo: "_energy-shard-types",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "image_name",
         type: "text",
      },
      {
         name: "icon_round_name",
         type: "text",
      },
      {
         name: "icon_bg_charinfo_name",
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
         name: "icon_round",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_bg_charinfo",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "break_data",
         type: "array",
         fields: [
            {
               name: "break_stage",
               type: "number",
            },
            {
               name: "max_level",
               type: "number",
            },
            {
               name: "required_item",
               type: "array",
               fields: [
                  {
                     name: "item",
                     type: "relationship",
                     relationTo: "materials",
                  },
                  {
                     name: "count",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "attributes",
         type: "array",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "_stats",
            },
            {
               name: "values",
               type: "json",
            },
         ],
      },
      {
         name: "factory_skills",
         type: "array",
         fields: [
            {
               name: "factory_skill",
               type: "relationship",
               relationTo: "factory-skills",
            },
            {
               name: "break_stage",
               type: "number",
            },
         ],
      },
      {
         name: "skill_level_up",
         type: "array",
         fields: [
            {
               name: "skill",
               type: "relationship",
               relationTo: "skills",
            },
            {
               name: "skill_type",
               type: "text",
            },
            {
               name: "level",
               type: "number",
            },
            {
               name: "gold_cost",
               type: "number",
            },
            {
               name: "item_cost",
               type: "array",
               fields: [
                  {
                     name: "item",
                     type: "relationship",
                     relationTo: "materials",
                  },
                  {
                     name: "count",
                     type: "number",
                  },
               ],
            },
         ],
      },
      {
         name: "profile_voice",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "text",
               type: "textarea",
            },
            {
               name: "voice_id",
               type: "text",
            },
            {
               name: "voice_file",
               type: "upload",
               relationTo: "images",
            },
         ],
      },
      {
         name: "profile_record",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "text",
               type: "textarea",
            },
            {
               name: "record_id",
               type: "text",
            },
         ],
      },
      {
         name: "break_stage_effect",
         type: "array",
         fields: [
            {
               name: "break_stage",
               type: "number",
            },
            {
               name: "skill_effect",
               type: "array",
               fields: [
                  {
                     name: "skill_type",
                     type: "text",
                  },
                  {
                     name: "max_level",
                     type: "number",
                  },
               ],
            },
            {
               name: "skill_unlock",
               type: "relationship",
               relationTo: "skills",
               hasMany: true,
            },
            {
               name: "factory_skill_unlock",
               type: "relationship",
               relationTo: "factory-skills",
               hasMany: true,
            },
         ],
      },
      {
         name: "talent_data_bundle",
         type: "array",
         fields: [
            {
               name: "index",
               type: "number",
            },
            {
               name: "break_stage",
               type: "number",
            },
            {
               name: "rank",
               type: "number",
            },
            {
               name: "potential",
               type: "number",
            },
            {
               name: "name",
               type: "text",
            },
            {
               name: "desc",
               type: "textarea",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
