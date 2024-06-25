import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Skills: CollectionConfig = {
   slug: "skills",
   labels: { singular: "skill", plural: "skills" },
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
         name: "icon_id",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_bg_type",
         type: "text",
      },
      {
         name: "levels",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "description",
               type: "textarea",
            },
            {
               name: "cost_val",
               type: "number",
            },
            {
               name: "cool_down",
               type: "number",
            },
            {
               name: "max_charge_time",
               type: "number",
            },
            {
               name: "blackboard",
               type: "json",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
