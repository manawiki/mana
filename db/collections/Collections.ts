import type { CollectionConfig } from "payload/types";
import { isAdmin, isAdminOrSiteOwnerOrSiteAdmin, isLoggedIn } from "../access";

export const collectionsSlug = "collections";
export const Collections: CollectionConfig = {
  slug: collectionsSlug,
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
      name: "id",
      type: "text",
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      hasMany: false,
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
  ],
};
