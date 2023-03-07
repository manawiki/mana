import type { CollectionConfig } from "payload/types";
import { isStaff, isStaffOrSiteOwnerOrSiteAdmin, isLoggedIn } from "../access";
import type { User } from "payload/generated-types";

export const entriesSlug = "entries";
export const Entries: CollectionConfig = {
   slug: entriesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isLoggedIn,
      read: (): boolean => true,
      update: isStaffOrSiteOwnerOrSiteAdmin("site"),
      delete: isStaff,
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
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
      {
         name: "notes",
         type: "relationship",
         relationTo: "notes",
         hasMany: true,
         maxDepth: 1,
      },
   ],
};
