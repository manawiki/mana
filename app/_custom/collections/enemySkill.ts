import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const EnemySkill: CollectionConfig = {
   slug: "enemySkill-lKJ16E5IhH",
   labels: { singular: "enemySkill", plural: "enemySkills" },
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
               collectionEntity: { equals: "enemySkill-lKJ16E5IhH" },
            };
         },
      },
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
         name: "sp_hit_base",
         type: "number",
      },
      {
         name: "delay_ratio",
         type: "number",
      },
      {
         name: "skill_trigger_key",
         type: "text",
      },
      {
         name: "damage_type",
         type: "relationship",
         relationTo: "_element-lKJ16E5IhH",
         hasMany: false,
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "type",
         type: "text",
      },
      {
         name: "skill_params",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
