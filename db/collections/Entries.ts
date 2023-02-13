import type { CollectionConfig } from "payload/types";
import { isAdmin, isAdminOrSiteOwnerOrSiteAdmin, isLoggedIn } from "../access";

export const entriesSlug = "entries";
export const Entries: CollectionConfig = {
  slug: entriesSlug,
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: isLoggedIn,
    read: (): boolean => true,
    update: isAdminOrSiteOwnerOrSiteAdmin("site"),
    delete: isAdmin,
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
