import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../../utils/typsense.server";

export const customPagesAfterDeleteHook: CollectionAfterDeleteHook = async ({
   req: { payload, user },
   id,
   doc,
}) => {
   try {
      //Delete custom pages from search index
      await typesensePrivateClient
         .collections("customPages")
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

export const customPagesAfterChangeHook: CollectionAfterChangeHook = async ({
   req: { payload },
   doc,
}) => {
   try {
      const customPageRelativeURL = `/${doc.slug}`;
      const customPageAbsoluteURL = `https://${
         doc.site.domain ? doc.site.domain : `${doc?.site?.slug}.mana.wiki`
      }${customPageRelativeURL}`;

      const description = doc?.description;

      const iconUrl = doc?.icon?.url;

      await typesensePrivateClient
         .collections("customPages")
         .documents()
         .upsert({
            id: doc.id,
            name: doc.name,
            relativeURL: customPageRelativeURL,
            absoluteURL: customPageAbsoluteURL,
            site: doc.site.id ?? doc.site,
            category: "Page",
            ...(description && { description: description }),
            ...(iconUrl && { icon: iconUrl }),
         });

      return doc;
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
