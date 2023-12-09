import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";

export const PostTags: CollectionConfig = {
   slug: "postTags",
   access: {
      create: canMutateAsSiteAdmin("updates"),
      read: () => true,
      update: canMutateAsSiteAdmin("updates"),
      delete: canMutateAsSiteAdmin("updates"),
   },
   fields: [
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 0,
      },
      {
         name: "slug",
         type: "text",
      },
   ],
};
