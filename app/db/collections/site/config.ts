import type { CollectionConfig } from "payload/types";

import { canEditSite, siteFieldAsSiteAdmin } from "./access";
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
      update: canEditSite,
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
         access: {
            update: isStaffFieldLevel,
         },
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
         access: {
            update: isStaffFieldLevel,
         },
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
      },
      {
         name: "type",
         type: "select",
         required: true,
         defaultValue: "core",
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
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "flyAppId",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "flyAppDBId",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "v6IP",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "v6IPDB",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "v4IP",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "v4IPDB",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "domain",
         type: "text",
         unique: true,
         access: {
            update: siteFieldAsSiteAdmin,
         },
      },
      {
         name: "customDomainInvoiceId",
         type: "text",
         access: {
            read: siteFieldAsSiteAdmin,
            update: siteFieldAsSiteAdmin,
         },
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
         access: {
            update: isStaffFieldLevel,
         },
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
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "totalEntries",
         type: "number",
         access: {
            update: isStaffFieldLevel,
         },
      },
   ],
   hooks: {
      afterChange: [afterCreateSite],
   },
};
