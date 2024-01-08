import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _LevelUpSkillImportanceClassifications: CollectionConfig = {
   slug: "_level-up-skill-importance-classifications",
   labels: {
      singular: "_Level-Up-Skill-Importance-Classification",
      plural: "_Level-Up-Skill-Importance-Classifications",
   },
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
         name: "drupal_tid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "description",
         type: "textarea",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
