import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../../utils/typsense.server";

export const entriesAfterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id,
   doc,
}) => {
   try {
      //Delete entries from search index
      await typesensePrivateClient
         .collections("entries")
         .documents(`${id}`)
         .delete();

      await payload.delete({
         collection: "contentEmbeds",
         where: {
            relationId: { equals: doc.id },
         },
      });

      const iconId = doc?.icon?.id;

      if (iconId) {
         await payload.delete({
            collection: "images",
            id: iconId,
            overrideAccess: false,
            user,
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const entriesAfterChangeHook: CollectionAfterChangeHook = async ({
   req: { payload },
   doc,
}) => {
   try {
      const entryRelativeURL = `/c/${doc.collectionEntity.slug}/${doc.slug}`;
      const entryAbsoluteURL = `https://${
         doc?.site?.domain ? doc?.site?.domain : `${doc?.site?.slug}.mana.wiki`
      }${entryRelativeURL}`;

      const { url: iconUrl } = doc?.icon?.url
         ? { url: doc?.icon?.url }
         : doc?.icon
           ? await payload.findByID({
                collection: "images",
                id: doc?.icon,
                depth: 0,
             })
           : { url: null };

      const description = doc?.collectionEntity?.name;

      await typesensePrivateClient
         .collections("entries")
         .documents()
         .upsert({
            id: doc.id,
            name: doc.name,
            relativeURL: entryRelativeURL,
            absoluteURL: entryAbsoluteURL,
            site: doc?.site?.id ?? doc.site,
            collection: doc.collectionEntity.name,
            category: "Entry",
            ...(description && { description: description }),
            ...(iconUrl && { icon: iconUrl }),
         });

      return doc;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
