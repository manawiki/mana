import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../../utils/typsense.server";

export const collectionsAfterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id, // id of document to delete
   doc, // deleted document
}) => {
   try {
      //Delete collections from search index
      await typesensePrivateClient
         .collections("collections")
         .documents(`${id}`)
         .delete();

      const siteId = doc?.site?.id ?? doc?.site;

      const iconId = doc?.icon?.id ?? doc?.icon;

      if (iconId) {
         await payload.delete({
            collection: "images",
            id: iconId,
            overrideAccess: false,
            user,
         });
      }
      if (doc?.site?.collections) {
         let collections = [] as string[];

         if (doc.site?.collections?.length > 1) {
            collections = doc?.site?.collections.filter(
               (item: string) => item !== id,
            );
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
export const collectionsAfterChangeHook: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation, // name of the operation ie. 'create', 'update'
}) => {
   try {
      //Sync with search
      const collectionRelativeURL = `/c/${doc.slug}`;
      const collectionAbsoluteURL = `https://${
         doc?.site?.domain ? doc?.site?.domain : `${doc?.site?.slug}.mana.wiki`
      }${collectionRelativeURL}`;

      //Due to the way Payload handles depth in relationships, we need to fetch the icon URL if it exists
      const { url: iconUrl } = doc?.icon?.url
         ? { url: doc?.icon?.url }
         : doc?.icon
           ? await payload.findByID({
                collection: "images",
                id: doc?.icon,
                depth: 0,
             })
           : { url: null };

      await typesensePrivateClient
         .collections("collections")
         .documents()
         .upsert({
            id: doc.id,
            name: doc.name,
            relativeURL: collectionRelativeURL,
            absoluteURL: collectionAbsoluteURL,
            site: doc?.site?.id ?? doc.site,
            category: "List",
            ...(iconUrl && { icon: iconUrl }),
         });

      //Add collection to sites collection
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
