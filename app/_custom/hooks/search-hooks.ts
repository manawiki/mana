import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../utils/typsense.server";

export const afterDeleteSearchSyncHook: CollectionAfterDeleteHook = async ({
   collection,
   req: { payload },
   id,
}) => {
   try {
      const siteId = process.env.SITE_ID;

      if (siteId) {
         //Delete entries from search index
         await typesensePrivateClient
            .collections("entries")
            .documents(`${collection.slug}-${siteId}-${id}`)
            .delete();
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const afterChangeSearchSyncHook: CollectionAfterChangeHook = async ({
   collection,
   req: { payload },
   doc,
}) => {
   try {
      const siteId = process.env.SITE_ID;
      const domain = process.env.HOST_DOMAIN;

      const collectionName = collection?.labels?.singular ?? collection?.slug;

      if (!siteId) {
         return payload.logger.error(
            `Site ID not defined in ./_custom/config.ts`,
         );
      }

      if (!collectionName) {
         return payload.logger.error(
            `Singular collection label not defined in collection configuration`,
         );
      }

      if (siteId && collectionName) {
         const entryRelativeURL = `/c/${collection.slug}/${doc.slug}`;
         const entryAbsoluteURL = `https://${
            domain ? domain : `${process.env.SITE_SLUG}.mana.wiki`
         }${entryRelativeURL}`;

         const iconUrl = doc?.icon?.url;

         await typesensePrivateClient
            .collections("entries")
            .documents()
            .upsert({
               id: `${collection.slug}-${siteId}-${doc.id}`,
               name: doc.name,
               relativeURL: entryRelativeURL,
               absoluteURL: entryAbsoluteURL,
               site: siteId,
               collection: collectionName,
               category: "Entry",
               ...(iconUrl && { icon: iconUrl }),
            });

         return doc;
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
