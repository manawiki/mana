import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin, canReadPost } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";

export const Posts: CollectionConfig = {
   slug: "posts",
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("posts"),
      //@ts-ignore
      read: canReadPost(),
      update: canMutateAsSiteAdmin("posts"),
      delete: canMutateAsSiteAdmin("posts"),
      readVersions: canMutateAsSiteAdmin("posts"),
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
         index: true,
      },
      {
         name: "subtitle",
         type: "text",
      },
      {
         name: "publishedAt",
         type: "date",
         index: true,
      },
      {
         name: "content",
         type: "relationship",
         relationTo: "postContents",
         required: true,
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
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
         maxDepth: 1,
      },
      {
         name: "tags",
         type: "relationship",
         relationTo: "postTags",
         hasMany: true,
      },
      {
         name: "banner",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "totalComments",
         type: "number",
      },
      {
         name: "totalBookmarks",
         type: "number",
      },
      {
         name: "maxCommentDepth",
         type: "number",
         defaultValue: 1,
         min: 1,
      },
   ],
};
