import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const Materials: CollectionConfig = {
   slug: "materials-lKJ16E5IhH",
   labels: { singular: "Material", plural: "Materials" },
   admin: { group: "Custom" },

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
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "story",
         type: "text",
      },
      {
         name: "type",
         type: "select",
         hasMany: true,
         admin: {
            isClearable: true,
            isSortable: true,
         },
         options: [
            {
               label: "Consumables",
               value: "consumables",
            },
            {
               label: "Synthesis Material",
               value: "synthesis-material",
            },
         ],
      },
   ],
};
