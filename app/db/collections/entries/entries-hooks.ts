import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../../utils/typsense.server";

export const afterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id,
   doc,
}) => {
   try {
      await payload.delete({
         collection: "contentEmbeds",
         where: {
            relationId: { equals: doc.id },
         },
      });

      await typesensePrivateClient
         .collections("entries")
         .documents(`${id}`)
         .delete();

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
   operation,
   doc,
}) => {
   try {
      const entriesUrl = `https://${
         doc.site?.domain ? doc.site?.domain : `${doc.site.slug}.mana.wiki`
      }/c/${doc.collectionEntity.slug}/${doc.slug}`;

      const iconUrl = doc?.icon?.url;

      await typesensePrivateClient
         .collections("entries")
         .documents()
         .upsert({
            id: doc.id,
            name: doc.name,
            url: entriesUrl,
            site: doc.site.id,
            collection: doc.collectionEntity.name,
            ...(iconUrl && { icon: iconUrl }),
         });

      return doc;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
