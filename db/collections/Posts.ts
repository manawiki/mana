import type { CollectionConfig } from "payload/types";
import { isStaffFieldLevel, isStaffOrSiteOwnerOrSiteAdmin } from "../access";
import type { User } from "payload/generated-types";

export const postsslug = "posts";
export const Posts: CollectionConfig = {
   slug: postsslug,
   // auth: true,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isStaffOrSiteOwnerOrSiteAdmin("site"),
      read: () => true,
      update: isStaffOrSiteOwnerOrSiteAdmin("site"),
      delete: isStaffOrSiteOwnerOrSiteAdmin("site"),
      readVersions: isStaffOrSiteOwnerOrSiteAdmin("site"),
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "url",
         type: "text",
      },
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "subtitle",
         type: "text",
      },
      {
         name: "publishedAt",
         type: "date",
      },
      {
         name: "content",
         type: "json",
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 2,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 0,
      },
      {
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
      { name: "isPublished", type: "checkbox", defaultValue: false },
      {
         name: "collaboration",
         type: "checkbox",
         label: "Enable Collaboration",
         defaultValue: false,
      },
   ],
   versions: {
      drafts: true,
      maxPerDoc: 60,
   },
};
