import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const EnemySkills: CollectionConfig = {
   slug: "enemySkills",
   labels: { singular: "enemySkill", plural: "enemySkills" },
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
         name: "icon",
         type: "upload",
         relationTo: "images",
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
         relationTo: "_elements",
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
