import type { CollectionConfig } from "payload/types";

import { canMutateAsSiteAdmin, canRead } from "../../access/site";

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
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         required: true,
         maxDepth: 1,
      },
   ],
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
