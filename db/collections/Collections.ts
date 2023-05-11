import type { CollectionConfig } from "payload/types";
import { canMutateAsSiteAdmin, isStaffFieldLevel } from "../access";

export const collectionsSlug = "collections";
export const Collections: CollectionConfig = {
   slug: collectionsSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: canMutateAsSiteAdmin("collections"),
      read: (): boolean => true,
      update: canMutateAsSiteAdmin("collections"),
      delete: canMutateAsSiteAdmin("collections"),
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
         name: "customDatabase",
         type: "checkbox",
         label: "Pull data from custom database",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "customEntryTemplate",
         type: "checkbox",
         label: "Enable custom entry template",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "customListTemplate",
         type: "checkbox",
         label: "Enable custom list template",
         defaultValue: false,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "hiddenCollection",
         type: "checkbox",
         label: "Hide Collection",
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
