import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   canCreateEntry,
   canUpdateEntry,
   canDeleteEntry,
} from "./entries-access";
import {
   entriesAfterDeleteHook,
   entriesAfterChangeHook,
} from "./entries-hooks";

export const entriesSlug = "entries";

export const Entries: CollectionConfig = {
   slug: entriesSlug,
   admin: {
      useAsTitle: "name",
   },
   hooks: {
      afterDelete: [entriesAfterDeleteHook],
      afterChange: [entriesAfterChangeHook],
   },
   access: {
      create: canCreateEntry,
      read: (): boolean => true,
      update: canUpdateEntry,
      delete: canDeleteEntry,
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
         name: "collectionEntity",
         type: "relationship",
         relationTo: "collections",
         hasMany: false,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
   ],
};
