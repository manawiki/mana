import type { CollectionConfig } from "payload/types";
import {
   isStaff,
   isStaffFieldLevel,
   isStafforUser,
   isLoggedIn,
} from "../access";
import type { User } from "payload/generated-types";

export const postsslug = "posts";
export const Posts: CollectionConfig = {
   slug: postsslug,
   // auth: true,
   admin: {
      useAsTitle: "title",
   },
   access: {
      create: isLoggedIn,
      read: () => true, //isAdminAuthororPublished
      update: isStafforUser("author"), //isAdminorAuthor
      delete: isStaff, //isAdminorAuthor
   },
   fields: [
      {
         name: "title",
         type: "text",
         required: true,
         index: true,
      },
      {
         name: "publishedAt",
         type: "date",
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
      {
         name: "notes",
         type: "relationship",
         relationTo: "notes",
         hasMany: true,
         maxDepth: 1,
      },
      { name: "isPublished", type: "checkbox", defaultValue: false },
   ],
};
