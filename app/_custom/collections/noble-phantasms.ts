import type { CollectionConfig } from "payload/types";
import { Update_TermRelationsOneDeep } from "./hooks/Update_TermRelationsOneDeep";
import { Delete_TermRelationsOneDeep } from "./hooks/Delete_TermRelationsOneDeep";

import { isStaff } from "../../access/user";

export const NoblePhantasms: CollectionConfig = {
   slug: "noble-phantasms",
   labels: { singular: "Noble-Phantasm", plural: "Noble-Phantasms" },
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
         name: "name",
         type: "text",
      },
      {
         name: "not_available_na",
         type: "checkbox",
      },
      {
         name: "sub_name",
         type: "text",
      },
      {
         name: "rank",
         type: "text",
      },
      {
         name: "np_classification",
         type: "relationship",
         relationTo: "_np-classifications",
         hasMany: false,
      },
      {
         name: "card_type",
         type: "relationship",
         relationTo: "_np-attack-types",
         hasMany: false,
      },
      {
         name: "target_type",
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
         name: "hit_count",
         type: "number",
      },
      {
         name: "description",
         type: "textarea",
      },
      {
         name: "description_overcharge",
         type: "textarea",
      },
      {
         name: "effect_list",
         type: "array",
         fields: [
            {
               name: "effect",
               type: "relationship",
               relationTo: "_skill-classification-specifics",
               hasMany: false,
            },
            {
               name: "effect_display",
               type: "text",
            },
            {
               name: "target",
               type: "relationship",
               relationTo: "_targets",
               hasMany: false,
            },
            {
               name: "turns",
               type: "number",
            },
            {
               name: "times",
               type: "number",
            },
            {
               name: "effect_condition",
               type: "relationship",
               relationTo: [
                  "_alignments",
                  "_attributes",
                  "_buff-categories",
                  "_classes",
                  "_command-cards",
                  "_enemy-traits",
                  "_field-types",
                  "_status-effects",
                  "_traits",
               ],
               hasMany: true,
            },
            {
               name: "effect_on_damage_turns",
               type: "number",
            },
            {
               name: "effect_on_damage_times",
               type: "number",
            },
            {
               name: "values_per_level",
               type: "json",
            },
            {
               name: "chance_per_level",
               type: "json",
            },
         ],
      },
      {
         name: "effect_list_overcharge",
         type: "array",
         fields: [
            {
               name: "effect",
               type: "relationship",
               relationTo: "_skill-classification-specifics",
               hasMany: false,
            },
            {
               name: "effect_display",
               type: "text",
            },
            {
               name: "target",
               type: "relationship",
               relationTo: "_targets",
               hasMany: false,
            },
            {
               name: "turns",
               type: "number",
            },
            {
               name: "times",
               type: "number",
            },
            {
               name: "effect_condition",
               type: "relationship",
               relationTo: [
                  "_alignments",
                  "_attributes",
                  "_buff-categories",
                  "_classes",
                  "_command-cards",
                  "_enemy-traits",
                  "_field-types",
                  "_status-effects",
                  "_traits",
               ],
               hasMany: true,
            },
            {
               name: "effect_on_damage_turns",
               type: "number",
            },
            {
               name: "effect_on_damage_times",
               type: "number",
            },
            {
               name: "values_per_level",
               type: "json",
            },
            {
               name: "chance_per_level",
               type: "json",
            },
         ],
      },
      {
         name: "unlock_condition",
         type: "text",
      },
      {
         name: "np_upgrades",
         type: "relationship",
         relationTo: "noble-phantasms",
         hasMany: true,
      },
      {
         name: "video_link",
         type: "text",
      },
      {
         name: "drupal_nid",
         type: "text",
      },
      {
         name: "data_key",
         type: "text",
      },
      {
         name: "path",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
