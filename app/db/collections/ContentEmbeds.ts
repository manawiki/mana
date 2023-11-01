import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin, canRead } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";

export const ContentEmbeds: CollectionConfig = {
   slug: "contentEmbeds",
   access: {
      create: canMutateAsSiteAdmin("contentEmbeds"),
      read: canRead("contentEmbeds"),
      update: canMutateAsSiteAdmin("contentEmbeds"),
      delete: canMutateAsSiteAdmin("contentEmbeds"),
      readVersions: canMutateAsSiteAdmin("contentEmbeds"),
   },
   fields: [
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
         name: "relationId",
         type: "text",
      },
      {
         name: "sectionId",
         type: "text",
      },
      {
         name: "subSectionId",
         type: "text",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
      },
      {
         name: "collectionEntity",
         type: "relationship",
         relationTo: "collections",
         hasMany: false,
      },
   ],
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
