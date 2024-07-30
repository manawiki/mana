import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   canCreatePost,
   canReadPost,
   canDeletePost,
   canUpdatePost,
} from "./posts-access";
import { postsAfterDeleteHook, postsAfterChangeHook } from "./posts-hooks";
import { isStaffFieldLevel } from "../users/users.access";

export const Posts: CollectionConfig = {
   slug: "posts",
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canCreatePost,
      read: canReadPost,
      update: canUpdatePost,
      delete: canDeletePost,
   },
   hooks: {
      afterDelete: [postsAfterDeleteHook],
      afterChange: [postsAfterChangeHook],
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
         maxDepth: 1,
         required: true,
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
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
         required: true,
      },
   ],
};
