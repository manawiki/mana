import type { CollectionConfig } from "payload/types";
import { isStaffFieldLevel } from "../../access/user";
import type { User } from "payload/generated-types";
import { canMutateAsSiteAdmin } from "../../access/site";

export const Embeds: CollectionConfig = {
   slug: "embeds",
   access: {
      create: canMutateAsSiteAdmin("posts"),
      read: () => true,
      update: canMutateAsSiteAdmin("posts"),
      delete: canMutateAsSiteAdmin("posts"),
      readVersions: canMutateAsSiteAdmin("posts"),
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
