import type { CollectionConfig } from "payload/types";

import { canMutateAsSiteAdmin, canRead } from "./site/access";
import { isStaffFieldLevel } from "../../access/user";
import { replaceVersionAuthor } from "../hooks/replaceVersionAuthor";
import type { User } from "../payload-types";

export const PostContents: CollectionConfig = {
   slug: "postContents",
   access: {
      create: canMutateAsSiteAdmin("postContents"),
      read: canRead("postContents"),
      update: canMutateAsSiteAdmin("postContents"),
      delete: canMutateAsSiteAdmin("postContents"),
      readVersions: canMutateAsSiteAdmin("postContents"),
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "content",
         type: "json",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         maxDepth: 1,
      },
      {
         name: "versionAuthor",
         type: "relationship",
         relationTo: "users",
         maxDepth: 3,
         required: false,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
         admin: {
            hidden: true,
         },
      },
   ],
   hooks: {
      beforeChange: [replaceVersionAuthor],
   },
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
