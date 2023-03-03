import type { CollectionConfig } from "payload/types";
import {
   isStaff,
   isStaffFieldLevel,
   isStaffOrHasSiteAccess,
   isLoggedIn,
} from "../access";

export const sitesSlug = "sites";
export const Sites: CollectionConfig = {
   slug: sitesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isLoggedIn,
      read: (): boolean => true,
      update: isStaffOrHasSiteAccess("id"),
      delete: isStaff,
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "featured",
         type: "checkbox",
         label: "Feature this site on the homepage",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "type",
         type: "select",
         required: true,
         defaultValue: "core",
         access: {
            update: isStaffFieldLevel,
         },
         options: [
            {
               label: "Core",
               value: "core",
            },
            {
               label: "Custom",
               value: "custom",
            },
         ],
      },
      {
         name: "subdomain",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "owner",
         type: "relationship",
         relationTo: "users",
         hasMany: false,
      },
      {
         name: "admins",
         type: "relationship",
         relationTo: "users",
         hasMany: true,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
         admin: {
            hidden: true,
         },
      },
      {
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "id",
         type: "text",
         admin: {
            hidden: true,
         },
      },
   ],
};
