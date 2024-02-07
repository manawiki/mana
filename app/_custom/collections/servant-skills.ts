import type { CollectionConfig } from "payload/types";
import { Update_TermRelationsOneDeep } from "./hooks/Update_TermRelationsOneDeep";
import { Delete_TermRelationsOneDeep } from "./hooks/Delete_TermRelationsOneDeep";

import { isStaff } from "../../db/collections/users/access";

export const ServantSkills: CollectionConfig = {
   slug: "servant-skills",
   labels: { singular: "Servant-Skill", plural: "Servant-Skills" },
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
         name: "_release_Status",
         type: "relationship",
         relationTo: "_release-statuses",
         hasMany: false,
         required: false,
      },
      {
         name: "_skill_Image",
         type: "relationship",
         relationTo: "_skill-images",
         hasMany: false,
         required: false,
      },
      {
         name: "cooldown",
         type: "number",
      },
      {
         name: "description",
         type: "textarea",
      },
      {
         name: "effect_value_table",
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
               name: "target",
               type: "relationship",
               relationTo: "_targets",
               hasMany: false,
            },
            {
               name: "value_single",
               type: "number",
            },
            {
               name: "value_type",
               type: "select",
               hasMany: false,
               options: [
                  {
                     label: "flat",
                     value: "flat",
                  },
                  {
                     label: "percent",
                     value: "percent",
                  },
               ],
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
               type: "number",
               hasMany: true,
            },
            {
               name: "chance_per_level",
               type: "number",
               hasMany: true,
            },
         ],
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
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
