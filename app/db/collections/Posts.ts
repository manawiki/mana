import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin, canRead } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";
import {replaceVersionAuthor} from "../hooks/replaceVersionAuthor";

export const Posts: CollectionConfig = {
   slug: "posts",
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("posts"),
      read: canRead("posts"),
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
         maxDepth: 1,
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
         name: "versionAuthor",
         type: "relationship",
         relationTo: "users",
         maxDepth: 3,
         required: false,
         admin: {
            hidden: true,
         }
      },
   ],
   hooks: {
      beforeChange: [replaceVersionAuthor]
   },
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
