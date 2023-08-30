import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Banners: CollectionConfig = {
   slug: "banners",
   labels: { singular: "Banner", plural: "Banners" },
   admin: {
      group: "Custom",
      useAsTitle: "name_full",
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
         name: "banner_id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "gacha_id",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "name_full",
         type: "text",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "type",
         type: "select",
         options: [
            {
               label: "Standard",
               value: "standard",
            },
            {
               label: "Beginner",
               value: "beginner",
            },
            {
               label: "Limited",
               value: "limited",
            },
            {
               label: "Light Cone",
               value: "light_cone",
            },
         ],
      },
      {
         name: "run",
         type: "number",
      },
      {
         name: "start_date",
         type: "date",
         admin: {
            date: {
               pickerAppearance: "dayAndTime",
               displayFormat: "yyyy-MM-dd H:mm:ss X",
            },
         },
      },
      {
         name: "end_date",
         type: "date",
         admin: {
            date: {
               pickerAppearance: "dayAndTime",
               displayFormat: "yyyy-MM-dd H:mm:ss X",
            },
         },
      },
      {
         name: "featured_characters",
         type: "relationship",
         relationTo: "characters",
         hasMany: true,
      },
      {
         name: "featured_light_cones",
         type: "relationship",
         relationTo: "lightCones",
         hasMany: true,
      },
      {
         name: "banner_characters",
         type: "relationship",
         relationTo: "characters",
         hasMany: true,
      },
      {
         name: "banner_light_cones",
         type: "relationship",
         relationTo: "lightCones",
         hasMany: true,
      },
   ],
};
