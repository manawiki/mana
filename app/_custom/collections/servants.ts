import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Servants: CollectionConfig = {
   slug: "servants",
   labels: { singular: "Servant", plural: "Servants" },
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
         name: "release_status",
         type: "relationship",
         relationTo: "_release-statuses",
         hasMany: false,
      },
      {
         label: "tags",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "tags",
               type: "relationship",
               relationTo: "_tags",
               hasMany: true,
            },
         ],
      },
      {
         label: "ratings",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "damage_rating",
               type: "number",
            },
            {
               name: "critical_rating",
               type: "number",
            },
            {
               name: "support_rating",
               type: "number",
            },
            {
               name: "durability_rating",
               type: "number",
            },
            {
               name: "utility_rating",
               type: "number",
            },
            {
               name: "np_gain_rating",
               type: "number",
            },
         ],
      },
      {
         label: "write-up",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "writeup_overview",
               type: "textarea",
            },
            {
               name: "writeup_gameplay_tips",
               type: "textarea",
            },
            {
               name: "writeup_tier_list_explanation",
               type: "textarea",
            },
            {
               name: "writeup_strengths",
               type: "textarea",
            },
            {
               name: "writeup_weaknesses",
               type: "textarea",
            },
            {
               name: "writeup_skill_level_explanation",
               type: "textarea",
            },
            {
               name: "writeup_skill_level_recommendation",
               type: "array",
               fields: [
                  {
                     name: "level_up_skill",
                     type: "relationship",
                     relationTo: "servant-skills",
                     hasMany: false,
                  },
                  {
                     name: "level_up_importance",
                     type: "relationship",
                     relationTo: "_level-up-skill-importance-classifications",
                     hasMany: false,
                  },
               ],
            },
            {
               name: "writeup_recommended_ces",
               type: "textarea",
            },
            {
               name: "recommended_ces",
               type: "relationship",
               relationTo: "craft-essences",
               hasMany: true,
            },
         ],
      },
      {
         label: "interlude_rank_up",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "interlude_quests",
               type: "array",
               fields: [
                  {
                     name: "quest",
                     type: "relationship",
                     relationTo: "quests",
                     hasMany: false,
                  },
                  {
                     name: "quest_nickname",
                     type: "text",
                  },
                  {
                     name: "ascension",
                     type: "text",
                  },
                  {
                     name: "bond",
                     type: "number",
                  },
                  {
                     name: "chapter",
                     type: "relationship",
                     relationTo: "_chapters",
                     hasMany: false,
                  },
                  {
                     name: "available",
                     type: "checkbox",
                  },
                  {
                     name: "interlude_reward",
                     type: "relationship",
                     relationTo: "_interlude-quest-rewards",
                     hasMany: false,
                  },
                  {
                     name: "specific_info",
                     type: "textarea",
                  },
               ],
            },
         ],
      },
      {
         label: "skills",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "skills",
               type: "array",
               fields: [
                  {
                     name: "skill",
                     type: "relationship",
                     relationTo: "servant-skills",
                     hasMany: false,
                  },
                  {
                     name: "unlock",
                     type: "textarea",
                  },
                  {
                     name: "upgrades",
                     type: "array",
                     fields: [
                        {
                           name: "skill",
                           type: "relationship",
                           relationTo: "servant-skills",
                           hasMany: false,
                        },
                        {
                           name: "unlock",
                           type: "textarea",
                        },
                     ],
                  },
               ],
            },
            {
               name: "append_skills",
               type: "relationship",
               relationTo: "append-skills",
               hasMany: true,
            },
            {
               name: "class_skills",
               type: "relationship",
               relationTo: "class-skills",
               hasMany: true,
            },
            {
               name: "class_skill_unlock",
               type: "textarea",
            },
            {
               name: "noble_phantasm_base",
               type: "relationship",
               relationTo: "noble-phantasms",
               hasMany: false,
            },
         ],
      },
      {
         label: "images",
         type: "collapsible",
         admin: { initCollapsed: false },
         fields: [
            {
               name: "image_stage_1",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "image_stage_2",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "image_stage_3",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "image_stage_4",
               type: "upload",
               relationTo: "images",
            },
            {
               name: "icon",
               type: "upload",
               relationTo: "images",
            },
         ],
      },
      {
         name: "authored_by",
         type: "text",
      },
      {
         label: "stats",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "atk_base",
               type: "number",
            },
            {
               name: "atk_max",
               type: "number",
            },
            {
               name: "atk_grail",
               type: "number",
            },
            {
               name: "atk_lv120",
               type: "number",
            },
            {
               name: "hp_base",
               type: "number",
            },
            {
               name: "hp_max",
               type: "number",
            },
            {
               name: "hp_grail",
               type: "number",
            },
            {
               name: "hp_lv120",
               type: "number",
            },
            {
               name: "star_generation_rate",
               type: "number",
            },
            {
               name: "star_absorption",
               type: "number",
            },
            {
               name: "instant_death_chance",
               type: "number",
            },
            {
               name: "np_charge_per_hit",
               type: "number",
            },
            {
               name: "np_charge_when_attacked",
               type: "number",
            },
            {
               name: "np_per_hit_quick",
               type: "number",
            },
            {
               name: "np_per_hit_arts",
               type: "number",
            },
            {
               name: "np_per_hit_buster",
               type: "number",
            },
            {
               name: "np_per_hit_extra",
               type: "number",
            },
            {
               name: "np_per_hit_np",
               type: "number",
            },
            {
               name: "damage_distribution_quick",
               type: "text",
            },
            {
               name: "damage_distribution_arts",
               type: "text",
            },
            {
               name: "damage_distribution_buster",
               type: "text",
            },
            {
               name: "damage_distribution_extra",
               type: "text",
            },
            {
               name: "damage_distribution_np",
               type: "text",
            },
            {
               label: "stats_array",
               type: "collapsible",
               admin: { initCollapsed: true },
               fields: [
                  {
                     name: "stats",
                     type: "json",
                  },
               ],
            },
         ],
      },
      {
         name: "costumes",
         type: "relationship",
         relationTo: "costumes",
         hasMany: true,
      },
      {
         label: "basic_info",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "cannot_pull",
               type: "checkbox",
            },
            {
               name: "library_id",
               type: "number",
            },
            {
               name: "cost",
               type: "number",
            },
            {
               name: "star_rarity",
               type: "relationship",
               relationTo: "_star-rarities",
               hasMany: false,
            },
            {
               name: "class",
               type: "relationship",
               relationTo: "_classes",
               hasMany: false,
            },
            {
               name: "attribute",
               type: "relationship",
               relationTo: "_attributes",
               hasMany: false,
            },
            {
               name: "series",
               type: "text",
            },
            {
               name: "country_origin",
               type: "text",
            },
            {
               name: "growth_curve",
               type: "relationship",
               relationTo: "_growth-curves",
               hasMany: false,
            },
            {
               name: "num_hits_quick",
               type: "number",
            },
            {
               name: "num_hits_arts",
               type: "number",
            },
            {
               name: "num_hits_buster",
               type: "number",
            },
            {
               name: "num_hits_extra",
               type: "number",
            },
            {
               name: "illustrator",
               type: "relationship",
               relationTo: "_illustrators",
               hasMany: false,
            },
            {
               name: "cv",
               type: "relationship",
               relationTo: "_cvs",
               hasMany: false,
            },
            {
               name: "deck_layout",
               type: "relationship",
               relationTo: "_deck-layouts",
               hasMany: false,
            },
            {
               name: "np_card_type",
               type: "relationship",
               relationTo: "_np-attack-types",
               hasMany: false,
            },
            {
               name: "np_target_type",
               type: "select",
               hasMany: false,
               options: [
                  {
                     label: "ST",
                     value: "st",
                  },
                  {
                     label: "AoE",
                     value: "aoe",
                  },
                  {
                     label: "Support",
                     value: "support",
                  },
               ],
            },
            {
               name: "alignment",
               type: "relationship",
               relationTo: "_alignments",
               hasMany: false,
            },
            {
               name: "traits",
               type: "relationship",
               relationTo: "_traits",
               hasMany: true,
            },
         ],
      },
      {
         label: "ascension_materials",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "ascension_materials",
               type: "array",
               fields: [
                  {
                     name: "qp_cost",
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
         ],
      },
      {
         label: "skill_enhancements",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "skill_enhancements",
               type: "array",
               fields: [
                  {
                     name: "qp_cost",
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
         ],
      },
      {
         label: "append_skill_enhancements",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "append_skill_enhancements",
               type: "array",
               fields: [
                  {
                     name: "qp_cost",
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
         ],
      },
      {
         name: "bond_experience",
         type: "number",
         hasMany: true,
      },
      {
         label: "profile",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "introduction",
               type: "textarea",
            },
            {
               name: "lore",
               type: "textarea",
            },
            {
               name: "valentines_ce",
               type: "relationship",
               relationTo: "craft-essences",
               hasMany: true,
            },
            {
               label: "parameters",
               type: "collapsible",
               fields: [
                  {
                     name: "str_grade",
                     type: "text",
                  },
                  {
                     name: "agl_grade",
                     type: "text",
                  },
                  {
                     name: "luk_grade",
                     type: "text",
                  },
                  {
                     name: "end_grade",
                     type: "text",
                  },
                  {
                     name: "mp_grade",
                     type: "text",
                  },
                  {
                     name: "np_grade",
                     type: "text",
                  },
                  {
                     name: "str_bar",
                     type: "number",
                  },
                  {
                     name: "agl_bar",
                     type: "number",
                  },
                  {
                     name: "luk_bar",
                     type: "number",
                  },
                  {
                     name: "end_bar",
                     type: "number",
                  },
                  {
                     name: "mp_bar",
                     type: "number",
                  },
                  {
                     name: "np_bar",
                     type: "number",
                  },
               ],
            },
            {
               name: "profile_entries",
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
                     type: "textarea",
                  },
               ],
            },
         ],
      },
      {
         name: "summon_availability",
         type: "relationship",
         relationTo: "_availabilities",
         hasMany: false,
      },
      {
         name: "jp_release_date",
         type: "text",
      },
      {
         name: "np_release_date",
         type: "text",
      },
      {
         name: "animation_costume_updates",
         type: "textarea",
      },
      {
         name: "spoiler_name",
         type: "text",
      },
      {
         name: "aka_aliases_nicknames",
         type: "text",
      },
      {
         name: "exclude_ranking",
         type: "checkbox",
      },
      {
         name: "tier_list_score",
         type: "number",
      },
      {
         name: "drupal_name_image_1",
         type: "text",
      },
      {
         name: "drupal_name_image_2",
         type: "text",
      },
      {
         name: "drupal_name_image_3",
         type: "text",
      },
      {
         name: "drupal_name_image_4",
         type: "text",
      },
      {
         name: "drupal_name_icon",
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
