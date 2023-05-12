import type { CollectionConfig } from "payload/types";
import { isStaff, isStaffFieldLevel, isLoggedIn } from "../access";

export const sitesSlug = "sites";
export const Sites: CollectionConfig = {
   slug: sitesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isLoggedIn,
      read: (): boolean => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "slug",
         type: "text",
         unique: true,
      },
      {
         name: "gaTagId",
         label: "Google Analytics tag id",
         type: "text",
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
         admin: {
            hidden: true,
         },
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "content",
         type: "json",
      },
   ],
};
