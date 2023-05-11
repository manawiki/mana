import type { CollectionConfig } from "payload/types";
import { canMutateAsSiteAdmin } from "../access";
import type { User } from "payload/generated-types";

export const entriesSlug = "entries";
export const Entries: CollectionConfig = {
   slug: entriesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("entries"),
      read: (): boolean => true,
      update: canMutateAsSiteAdmin("entries"),
      delete: canMutateAsSiteAdmin("entries"),
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
      },
      {
         name: "collectionEntity",
         type: "relationship",
         relationTo: "collections",
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user.id,
         maxDepth: 2,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
   ],
};
