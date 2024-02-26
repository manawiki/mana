import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

export const afterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id, // id of document to delete
   doc, // deleted document
}) => {
   try {
      //If depth is greater that 0, need to check the nested site
      const siteId = doc.site.id ?? doc.site;

      const currentCollections = await payload.findByID({
         collection: "sites",
         id: siteId,
      });

      const iconId = doc.icon.id;

      if (iconId) {
         await payload.delete({
            collection: "images",
            id: iconId,
            overrideAccess: false,
            user,
         });
      }

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
export const afterChangeHook: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation, // name of the operation ie. 'create', 'update'
}) => {
   try {
      if (operation === "create") {
         //If depth is greater that 0, need to check the nested site
         const siteId = doc.site.id ?? doc.site;

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
