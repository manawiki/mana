import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const SkillTree: CollectionConfig = {
   slug: "skillTree",
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
         name: "description",
         type: "text",
      },
      {
         name: "character",
         type: "relationship",
         relationTo: "character",
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
         name: "affected_skill",
         type: "relationship",
         relationTo: "trace",
         hasMany: true,
         required: false,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
