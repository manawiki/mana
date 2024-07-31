import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "../../../utils/typsense.server";

export const postsAfterDeleteHook: CollectionAfterDeleteHook = async ({
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

export const postsAfterChangeHook: CollectionAfterChangeHook = async ({
   req: { payload },
   operation,
   doc,
}) => {
   try {
      if (operation === "update" && doc.content._status === "published") {
         const postRelativeURL = `/p/${doc.slug}`;
         const postAbsoluteURL = `https://${
            doc?.site?.domain
               ? doc?.site?.domain
               : `${doc?.site?.slug}.mana.wiki`
         }${postRelativeURL}`;

         const bannerUrl = doc?.banner?.url;
         const description = doc?.subtitle;

         await typesensePrivateClient
            .collections("posts")
            .documents()
            .upsert({
               id: doc.id,
               name: doc.name,
               relativeURL: postRelativeURL,
               absoluteURL: postAbsoluteURL,
               site: doc.site.id,
               category: "Post",
               ...(bannerUrl && { icon: bannerUrl }),
               ...(description && { description: description }),
            });

         return doc;
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
