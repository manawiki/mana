import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";
import { isStaffFieldLevel } from "../users/users.access";

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
         maxDepth: 0,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
   ],
};
