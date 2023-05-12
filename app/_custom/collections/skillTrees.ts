import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";

export const SkillTrees: CollectionConfig = {
   slug: "skillTrees",
   labels: { singular: "skillTree", plural: "skillTrees" },
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
         name: "point_id",
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
         name: "description",
         type: "text",
      },
      {
         name: "character",
         type: "relationship",
         relationTo: "characters",
         hasMany: false,
         required: false,
      },
      {
         name: "point_type",
         type: "number",
      },
      {
         name: "anchor",
         type: "text",
      },
      {
         name: "max_level",
         type: "number",
      },
      {
         name: "req_level",
         type: "number",
      },
      {
         name: "req_ascension",
         type: "number",
      },
      {
         name: "default_unlock",
         type: "checkbox",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "level_up_cost",
         type: "array",
         fields: [
            {
               name: "level",
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
         name: "stat_added",
         type: "array",
         fields: [
            {
               name: "stat_type",
               type: "relationship",
               relationTo: "_statTypes",
               hasMany: false,
            },
            {
               name: "value",
               type: "number",
            },
         ],
      },
      {
         name: "affected_skill",
         type: "relationship",
         relationTo: "traces",
         hasMany: true,
         required: false,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
