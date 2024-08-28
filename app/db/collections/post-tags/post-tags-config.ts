import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   canCreatePostTag,
   canDeletePostTag,
   canUpdatePostTag,
} from "./post-tags-access";
import { isStaffFieldLevel } from "../users/users.access";

export const PostTags: CollectionConfig = {
   slug: "postTags",
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canCreatePostTag,
      read: () => true,
      update: canUpdatePostTag,
      delete: canDeletePostTag,
   },
   fields: [
      {
         name: "name",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
      },
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         maxDepth: 0,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
      },
   ],
};
