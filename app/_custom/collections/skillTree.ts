import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const SkillTree: CollectionConfig = {
   slug: "skillTree-lKJ16E5IhH",
   labels: { singular: "skillTree", plural: "skillTrees" },
   admin: { 
         group: "Custom",
         useAsTitle:  "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
         required: true,
         filterOptions: () => {
            return {
               collectionEntity: { equals: "skillTree-lKJ16E5IhH" },
            };
         },
      },
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
         relationTo: "character-lKJ16E5IhH",
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
                     relationTo: "materials-lKJ16E5IhH",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
                  },
               ]
            },
         ],
      },
      {
         name: "affected_skill",
         type: "relationship",
         relationTo: "trace-lKJ16E5IhH",
         hasMany: true,
         required: false,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
