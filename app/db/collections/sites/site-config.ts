import type { CollectionConfig } from "payload/types";

import {
   canEditSite,
   canReadSite,
   canUpdateSiteRolesField,
} from "./site-access";
import { afterCreateSite } from "./site-hooks";
import { isStaff, isStaffFieldLevel, isLoggedIn } from "../users/users.access";

export const sitesSlug = "sites";
export const Sites: CollectionConfig = {
   slug: sitesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isLoggedIn,
      read: canReadSite,
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
         name: "adWebId",
         type: "text",
      },
      {
         name: "collections",
         type: "relationship",
         relationTo: "collections",
         hasMany: true,
      },
      {
         name: "partnerSites",
         type: "relationship",
         relationTo: "sites",
         hasMany: true,
      },
      {
         name: "menu",
         type: "array",
         maxRows: 10,
         fields: [
            {
               name: "name",
               type: "text",
               required: true,
            },
            {
               name: "links",
               type: "array",
               fields: [
                  {
                     name: "name",
                     type: "text",
                     required: true,
                  },
                  {
                     name: "path",
                     type: "text",
                     required: true,
                  },
                  {
                     name: "icon",
                     type: "text",
                  },
                  {
                     name: "hasCustomIcon",
                     type: "checkbox",
                     label: "Custom Icon",
                     defaultValue: false,
                  },
                  {
                     name: "nestedLinks",
                     type: "array",
                     fields: [
                        {
                           name: "name",
                           type: "text",
                           required: true,
                        },
                        {
                           name: "path",
                           type: "text",
                           required: true,
                        },
                        {
                           name: "icon",
                           type: "text",
                        },
                        {
                           name: "hasCustomIcon",
                           type: "checkbox",
                           label: "Custom Icon",
                           defaultValue: false,
                        },
                     ],
                  },
               ],
            },
         ],
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
         name: "logoDarkImage",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "logoLightImage",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "logoURL",
         type: "text",
      },
      {
         name: "id",
         type: "text",
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
         name: "announcementMessage",
         type: "text",
      },
      {
         name: "announcementLink",
         type: "text",
      },
      {
         name: "admins",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         hasMany: true,
         access: {
            update: canUpdateSiteRolesField,
         },
      },
      {
         name: "contributors",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         hasMany: true,
         access: {
            update: canUpdateSiteRolesField,
         },
      },
      {
         name: "isWhiteLabel",
         type: "checkbox",
         label: "White Label",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "domain",
         type: "text",
         unique: true,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "customDomainInvoiceId",
         type: "text",
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "trendingPages",
         type: "json",
         access: {
            update: isStaffFieldLevel,
         },
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
         name: "followers",
         type: "number",
         access: {
            update: isStaffFieldLevel,
         },
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
         maxDepth: 2,
         hasMany: false,
         access: {
            update: isStaffFieldLevel,
         },
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
