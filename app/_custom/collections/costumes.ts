import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Costumes: CollectionConfig = {
   slug: "costumes",
   labels: { singular: "Costume", plural: "Costumes" },
   admin: { group: "Custom", useAsTitle: "name" },

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
         name: "drupal_nid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "servant",
         type: "relationship",
         relationTo: "servants",
         hasMany: false,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "description",
         type: "text",
      },
      {
         label: "Materials",
         type: "collapsible",
         admin: { initCollapsed: true },
         fields: [
            {
               name: "costume_materials",
               type: "array",
               fields: [
                  {
                     name: "qp_cost",
                     type: "number",
                  },
                  {
                     name: "materials",
                     type: "array",
                     fields: [
                        {
                           name: "material",
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
               ],
            },
         ],
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
