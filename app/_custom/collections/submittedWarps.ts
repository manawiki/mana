import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const SubmittedWarps: CollectionConfig = {
   slug: "submittedWarps",
   labels: { singular: "submittedWarp", plural: "submittedWarps" },
   admin: {
      group: "Custom",
      useAsTitle: "id",
   },
   access: {
      create: () => true, //udpate in future to allow site admins as well
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
         name: "uid",
         type: "text",
      },
      {
         name: "user",
         type: "text",
      },
      {
         name: "gacha_id",
         type: "text",
      },
      {
         name: "gacha_type",
         type: "text",
      },
      {
         name: "item_id",
         type: "text",
      },
      {
         name: "count",
         type: "text",
      },
      {
         name: "time",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "lang",
         type: "text",
      },
      {
         name: "item_type",
         type: "text",
      },
      {
         name: "rank_type",
         type: "text",
      },
      {
         name: "submission_type",
         type: "select",
         options: [
            {
               label: "api",
               value: "api",
            },
            {
               label: "file",
               value: "file",
            },
         ],
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
   ],
};
