import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Eidolons: CollectionConfig = {
   slug: "eidolons",
   labels: { singular: "eidolon", plural: "eidolons" },
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
         name: "eidolon_id",
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
         name: "description",
         type: "text",
      },
      {
         name: "rank",
         type: "number",
      },
      {
         name: "trigger",
         type: "text",
      },
      {
         name: "unlock_materials",
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
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
