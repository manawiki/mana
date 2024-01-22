import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
   CollectionConfig,
} from "payload/types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";
import { isStaffFieldLevel } from "../../access/user";

export const collectionsSlug = "collections";

const afterChangeHook: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation, // name of the operation ie. 'create', 'update'
}) => {
   try {
      if (operation === "create") {
         //If depth is greater that 0, need to check the nested site
         const siteId = doc.site ?? doc.site.id;

         const currentCollections = await payload.findByID({
            collection: "sites",
            id: siteId,
            depth: 0,
         });

         if (
            !currentCollections?.collections ||
            currentCollections?.collections?.length === 0
         ) {
            payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  collections: [doc.id],
               },
            });
         }
         if (
            currentCollections?.collections &&
            currentCollections?.collections?.length > 0
         ) {
            const prevCollections = currentCollections.collections;

            payload.update({
               collection: "sites",
               id: siteId,
               data: {
                  collections: [...prevCollections, doc.id],
               },
            });
         }
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }

   return doc;
};

const afterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload },
   id, // id of document to delete
   doc, // deleted document
}) => {
   try {
      const siteId = doc.site.id;
      const currentCollections = await payload.findByID({
         collection: "sites",
         id: siteId,
      });

      if (currentCollections?.collections) {
         let collections = [] as string[];

         if (doc.site?.collections.length > 1) {
            //Delete existing collection from site
            collections = currentCollections.collections
               .map(({ id }: { id: string }) => id)
               .filter((item) => item !== id)
               .filter((e) => e);
         }

         payload.update({
            collection: "sites",
            id: siteId,
            data: {
               //@ts-ignore
               collections: collections,
            },
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

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
   hooks: {
      afterChange: [afterChangeHook],
      afterDelete: [afterDeleteHook],
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
         maxDepth: 1,
         required: true,
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
               required: true,
            },
            {
               name: "name",
               type: "text",
            },
            {
               name: "showTitle",
               type: "checkbox",
               label: "Display Title",
               defaultValue: false,
            },
            {
               name: "showAd",
               type: "checkbox",
               label: "Show Ad",
               defaultValue: false,
            },
            {
               name: "subSections",
               type: "array",
               label: "Sub-Sections",
               fields: [
                  {
                     name: "id",
                     type: "text",
                     required: true,
                  },
                  {
                     name: "name",
                     type: "text",
                  },
                  {
                     name: "type",
                     type: "select",
                     required: true,
                     options: [
                        {
                           label: "Editor",
                           value: "editor",
                        },
                        {
                           label: "Custom Template",
                           value: "customTemplate",
                        },
                        {
                           label: "Q & A",
                           value: "qna",
                        },
                        {
                           label: "Comments",
                           value: "comments",
                        },
                     ],
                  },
               ],
            },
         ],
      },
   ],
};
