import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";

export const Traces: CollectionConfig = {
   slug: "traces",
   labels: { singular: "trace", plural: "traces" },
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
         name: "trace_id",
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
         name: "desc_type",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "icon_ultra_name",
         type: "text",
      },
      {
         name: "description_per_level",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "description",
               type: "text",
            },
         ],
      },
      {
         name: "max_level",
         type: "number",
      },
      {
         name: "damage_type",
         type: "text",
      },
      {
         name: "effect_type",
         type: "text",
      },
      {
         name: "init_cooldown",
         type: "number",
      },
      {
         name: "cooldown",
         type: "number",
      },
      {
         name: "sp_ratio",
         type: "number",
      },
      {
         name: "bp_need",
         type: "number",
      },
      {
         name: "skill_need",
         type: "number",
      },
      {
         name: "delay_ratio",
         type: "number",
      },
      {
         name: "tag",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
