import type { CollectionConfig } from "payload/types";

import { canMutateAsSiteAdmin } from "../../access/site";
import { isStaffFieldLevel } from "../../access/user";

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
         index: true,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         maxDepth: 0,
         hasMany: false,
         index: true,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "sections",
         type: "array",
         label: "Sections",
         labels: {
            singular: "Section",
            plural: "Sections",
         },
         fields: [
            {
               name: "id",
               type: "text",
            },
            {
               name: "name",
               type: "text",
            },
         ],
      },
   ],
};
