import type { CollectionConfig } from "payload/types";
import {
   isStaff,
   isStaffFieldLevel,
   isStaffOrSiteOwnerOrSiteAdmin,
   isLoggedIn,
} from "../access";

export const collectionsSlug = "collections";
export const Collections: CollectionConfig = {
   slug: collectionsSlug,
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
         name: "customTemplate",
         type: "checkbox",
         label: "Use custom template",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "hiddenCollection",
         type: "checkbox",
         label: "Hidden Collection",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
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
