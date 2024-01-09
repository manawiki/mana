import type { CollectionConfig } from "payload/types";

import { siteFieldAsSiteAdmin } from "./access";
import { afterCreateSite } from "./hooks";
import { isStaff, isStaffFieldLevel, isLoggedIn } from "../../../access/user";

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
         name: "about",
         type: "text",
      },
      {
         name: "trendingPages",
         type: "json",
      },
      {
         name: "isPublic",
         type: "checkbox",
         label: "Public",
         defaultValue: false,
      },
      {
         name: "enableAds",
         type: "checkbox",
         label: "Enable Ads",
         defaultValue: false,
      },
      {
         name: "followers",
         type: "number",
      },
      {
         name: "collections",
         type: "relationship",
         relationTo: "collections",
         hasMany: true,
      },
      {
         name: "pinned",
         type: "array",
         label: "Pinned",
         maxRows: 10,
         labels: {
            singular: "Pinned Item",
            plural: "Pinned Items",
         },
         fields: [
            {
               name: "relation",
               type: "relationship",
               relationTo: ["customPages", "entries", "posts", "collections"],
               hasMany: false,
            },
         ],
      },
      {
         name: "slug",
         type: "text",
         unique: true,
         index: true,
      },
      {
         name: "gaTagId",
         label: "Google Analytics tag id",
         type: "text",
      },
      {
         name: "gaPropertyId",
         label: "Google Analytics property id",
         type: "text",
         access: {
            read: siteFieldAsSiteAdmin,
            update: siteFieldAsSiteAdmin,
         },
      },
      {
         name: "type",
         type: "select",
         required: true,
         defaultValue: "core",
         access: {
            update: siteFieldAsSiteAdmin,
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
         name: "flyAppId",
         type: "text",
      },
      {
         name: "flyAppDBId",
         type: "text",
      },
      {
         name: "v6IP",
         type: "text",
      },
      {
         name: "v6IPDB",
         type: "text",
      },
      {
         name: "v4IP",
         type: "text",
      },
      {
         name: "v4IPDB",
         type: "text",
      },
      {
         name: "domain",
         type: "text",
         unique: true,
      },
      {
         name: "status",
         type: "select",
         access: {
            update: isStaffFieldLevel,
         },
         options: [
            {
               label: "Verified",
               value: "verified",
            },
            {
               label: "Partner",
               value: "partner",
            },
         ],
      },
      {
         name: "category",
         type: "select",
         access: {
            update: isStaffFieldLevel,
         },
         options: [
            {
               label: "Gaming",
               value: "gaming",
            },
            {
               label: "Entertainment",
               value: "entertainment",
            },
            {
               label: "Other",
               value: "other",
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
         maxDepth: 2,
      },
      {
         name: "contributors",
         type: "relationship",
         relationTo: "users",
         hasMany: true,
         maxDepth: 2,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "favicon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "totalPosts",
         type: "number",
      },
      {
         name: "totalEntries",
         type: "number",
      },
   ],
   hooks: {
      afterChange: [afterCreateSite],
   },
};
