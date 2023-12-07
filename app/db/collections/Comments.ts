import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";

export const Comments: CollectionConfig = {
   slug: "comments",
   access: {
      create: canMutateAsSiteAdmin("comments"),
      read: () => true,
      update: canMutateAsSiteAdmin("comments"),
      delete: canMutateAsSiteAdmin("comments"),
   },
   fields: [
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
      },
      {
         name: "postParent",
         type: "relationship",
         relationTo: "posts",
      },
      {
         name: "sectionParentCollection",
         type: "relationship",
         relationTo: "collections",
      },
      {
         name: "sectionParentId",
         type: "text",
      },
      {
         name: "comment",
         type: "json",
      },
      {
         name: "isTopLevel",
         type: "checkbox",
         defaultValue: false,
      },
      {
         name: "isPinned",
         type: "checkbox",
      },
      {
         name: "upVotesStatic",
         type: "number",
      },
      {
         name: "replies",
         type: "relationship",
         relationTo: "comments",
         hasMany: true,
      },
      {
         name: "upVotes",
         type: "relationship",
         relationTo: "users",
         hasMany: true,
         maxDepth: 0,
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
      },
      {
         name: "nestedLevels",
         type: "number",
      },
   ],
};
