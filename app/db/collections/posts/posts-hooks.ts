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
         collection: "postContents",
         id,
         overrideAccess: true,
         user,
      });
      await typesensePrivateClient
         .collections("posts")
         .documents(`${id}`)
         .delete();

      const bannerId = doc?.banner?.id;

      if (bannerId) {
         await payload.delete({
            collection: "images",
            id: bannerId,
            overrideAccess: false,
            user,
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const postAfterChangeHook: CollectionAfterChangeHook = async ({
   req: { payload },
   operation,
   doc,
}) => {
   try {
      if (operation === "update" && doc.content._status === "published") {
         const postUrl = `https://${
            doc.site?.domain ? doc.site?.domain : `${doc.site.slug}.mana.wiki`
         }/p/${doc.slug}`;

         const bannerUrl = doc?.banner?.url;
         const subtitle = doc?.subtitle;

         await typesensePrivateClient
            .collections("posts")
            .documents()
            .upsert({
               id: doc.id,
               name: doc.name,
               url: postUrl,
               site: doc.site.id,
               ...(bannerUrl && { icon: bannerUrl }),
               ...(subtitle && { subtitle: subtitle }),
            });

         return doc;
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
