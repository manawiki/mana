import type {
   CollectionAfterChangeHook,
   CollectionConfig,
} from "payload/types";

import { isStaff, isStaffFieldLevel, isLoggedIn } from "../../access/user";
const afterCreateSite: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation, // name of the operation i.e. 'create', 'update'
}) => {
   try {
      // On site creation, create a default homeContents entry
      if (operation === "create") {
         const siteId = doc.slug;
         await payload.create({
            collection: "homeContents",
            data: {
               site: siteId,
               _status: "published",
               content: [
                  {
                     id: "viwnxpInwb-HSLnwixmaU",
                     type: "h2",
                     children: [
                        {
                           text: "Welcome to Mana",
                        },
                     ],
                  },
                  {
                     id: "jsowPnsUbN-UmsYfOpFtY",
                     type: "paragraph",
                     children: [
                        {
                           text: "This page was automatically generated during site creation, and it looks like it hasn't been replaced yet.",
                        },
                     ],
                  },
               ],
            },
         });
      }
   } catch (err: unknown) {
      console.log("ERROR");
      payload.logger.error(`${err}`);
   }

   return doc;
};

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
            read: isStaffFieldLevel,
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
