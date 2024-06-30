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
         name: "slug",
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
         name: "stats",
         type: "array",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "stats",
            },
            {
               name: "base",
               type: "number",
            },
            {
               name: "growth",
               type: "number",
            }
         ],
      },
      {
         name: "skills",
         type: "relationship",
         relationTo: "skills",
         hasMany: true,
      },
      {
         name: "core_skill",
         type: "relationship",
         relationTo: "agent-core-skills",
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
               name: "stat_adv",
               type: "array",
               fields: [
                  {
                     name: "stat",
                     type: "relationship",
                     relationTo: "stats",
                  },
                  {
                     name: "value",
                     type: "number",
                  },
               ],
            },
            {
               name: "stat_add",
               type: "array",
               fields: [
                  {
                     name: "stat",
                     type: "relationship",
                     relationTo: "stats",
                  },
                  {
                     name: "value",
                     type: "number",
                  },
               ],
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
      //{
      //   name: "quotes",
      //   type: "array",
      //   fields: [
      //      {
      //         name: "title",
      //         type: "text",
      //      },
      //      {
      //         name: "content",
      //         type: "text",
      //      },
      //      {
      //         name: "vo_zh",
      //         type: "upload",
      //         relationTo: "images",
      //      },
      //      {
      //         name: "vo_ja",
      //         type: "upload",
      //         relationTo: "images",
      //      },
      //      {
      //         name: "vo_en",
      //         type: "upload",
      //         relationTo: "images",
      //      },
      //      {
      //         name: "vo_ko",
      //         type: "upload",
      //         relationTo: "images",
      //      },
      //   ],
      //},
      {
         name: "checksum",
         type: "text",
      },
   ],
};
