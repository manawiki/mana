import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const termRelicstat: CollectionConfig = {
   slug: "termRelicstat-lKJ16E5IhH",
   labels: { singular: "termRelicstat", plural: "termRelicstats" },
   admin: { 
         group: "Custom",
         useAsTitle:  "stat_id",
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
               collectionEntity: { equals: "termRelicstat-lKJ16E5IhH" },
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
         name: "group_id",
         type: "text",
      },
      {
         name: "type",
         type: "text",
      },
      {
         name: "affix_id",
         type: "text",
      },
      {
         name: "term_stattype",
         type: "relationship",
         relationTo: "termStattype-lKJ16E5IhH",
         hasMany: false,
      },
      {
         name: "base_val",
         type: "number",
      },
      {
         name: "level_add",
         type: "number",
      },
      {
         name: "stats",
         type: "json",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
