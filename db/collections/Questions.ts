import type { CollectionConfig } from "payload/types";
import { isStaffFieldLevel, isStafforUser, isLoggedIn } from "../access";
import type { User } from "payload/generated-types";

export const questionslug = "questions";
export const Questions: CollectionConfig = {
   slug: questionslug,
   // auth: true,
   admin: {
      useAsTitle: "title",
   },
   access: {
      create: isLoggedIn,
      read: () => true, //isAdminAuthororPublished
      update: isStafforUser("author"), //isAdminorAuthor
      delete: isStafforUser("author"), //isAdminorAuthor
   },
   fields: [
      {
         name: "title",
         type: "text",
         required: true,
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
         name: "question",
         type: "relationship",
         relationTo: "notes",
         maxDepth: 1,
      },
      {
         name: "answers",
         type: "relationship",
         relationTo: "notes",
         hasMany: true,
         maxDepth: 1,
      },
      { name: "isPublished", type: "checkbox", defaultValue: true },
   ],
};
