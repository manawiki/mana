import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const FactorySkills: CollectionConfig = {
   slug: "factory-skills",
   labels: { singular: "factory-skill", plural: "factory-skills" },
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
         name: "desc",
         type: "textarea",
      },
      {
         name: "icon_id",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "sort_id",
         type: "number",
      },
      {
         name: "building_type",
         type: "text",
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "_factory-skill-types",
         hasMany: true,
      },
      {
         name: "effect_building",
         type: "relationship",
         relationTo: "buildings",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
