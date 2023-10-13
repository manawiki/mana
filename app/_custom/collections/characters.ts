import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Characters: CollectionConfig = {
   slug: "characters",
   labels: { singular: "Character", plural: "Characters" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "character_id",
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
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
         hasMany: false,
      },
      {
         name: "element",
         type: "relationship",
         relationTo: "_elements",
         hasMany: false,
      },
      {
         name: "path",
         type: "relationship",
         relationTo: "_paths",
         hasMany: false,
      },
      {
         name: "sp_need",
         type: "number",
      },
      {
         name: "exp_group",
         type: "number",
      },
      {
         name: "max_promotion",
         type: "number",
      },
      {
         name: "max_rank",
         type: "number",
      },
      {
         name: "eidolons",
         type: "relationship",
         relationTo: "eidolons",
         hasMany: true,
      },
      {
         name: "traces",
         type: "relationship",
         relationTo: "traces",
         hasMany: true,
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "image_round_icon_name",
         type: "text",
      },
      {
         name: "image_action_name",
         type: "text",
      },
      {
         name: "image_battle_detail_name",
         type: "text",
      },
      {
         name: "image_full_name",
         type: "text",
      },
      {
         name: "image_full_bg_name",
         type: "text",
      },
      {
         name: "image_full_front_name",
         type: "text",
      },
      {
         name: "image_draw_name",
         type: "text",
      },
      {
         name: "reward_list",
         type: "array",
         fields: [
            {
               name: "materials",
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
      {
         name: "reward_max_list",
         type: "array",
         fields: [
            {
               name: "materials",
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
      {
         name: "stats_csv",
         type: "textarea",
      },
      {
         name: "stats",
         type: "array",
         fields: [
            {
               name: "label",
               type: "text",
            },
            {
               name: "data",
               type: "json",
            },
         ],
         admin: {
            components: {
               RowLabel: ({ data, index }: any) => {
                  return (
                     data?.label || `Stat ${String(index).padStart(2, "0")}`
                  );
               },
            },
         },
      },
      {
         name: "promotion_cost",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "max_level",
               type: "number",
            },
            {
               name: "material_qty",
               type: "array",
               fields: [
                  {
                     name: "materials",
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
         name: "voice_lines",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "text",
               type: "text",
            },
            {
               name: "voice_en",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_jp",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_cn",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "voice_kr",
               type: "upload",
               relationTo: "images",
            },
         ],
      },
      {
         name: "cv_cn",
         type: "text",
      },
      {
         name: "cv_jp",
         type: "text",
      },
      {
         name: "cv_kr",
         type: "text",
      },
      {
         name: "cv_en",
         type: "text",
      },
      {
         name: "camp",
         type: "text",
      },
      {
         name: "story",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "text",
               type: "text",
            },
            {
               name: "unlock",
               type: "text",
            },
         ],
      },
      {
         name: "image_round_icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_action",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_battle_detail",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full_bg",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_full_front",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_draw",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "videos",
         type: "array",
         fields: [
            {
               name: "title",
               type: "text",
            },
            {
               name: "url",
               type: "text",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
      {
         name: "checksum_voice_lines",
         type: "text",
      },
      {
         name: "checksum_profile",
         type: "text",
      },
   ],
};
