import type { CollectionConfig } from "payload/types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";
import { canRead } from "../../access/canRead";
import { replaceVersionAuthor } from "../../hooks/replaceVersionAuthor";

export const HomeContents: CollectionConfig = {
   slug: "homeContents",
   access: {
      create: canMutateAsSiteAdmin("homeContents"),
      read: canRead("homeContents"),
      update: canMutateAsSiteAdmin("homeContents"),
      delete: canMutateAsSiteAdmin("homeContents"),
      readVersions: canMutateAsSiteAdmin("homeContents"),
   },
   fields: [
      {
         name: "content",
         type: "json",
      },
      {
         name: "versionAuthor",
         type: "relationship",
         relationTo: "users",
         maxDepth: 3,
         required: false,
         admin: {
            hidden: true,
         },
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         required: true,
         maxDepth: 1,
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
