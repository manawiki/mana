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
      console.log(doc);
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
   req: { payload, user },
   previousDoc,
   doc,
}) => {
   try {
      if (
         doc.content._status === "published" &&
         previousDoc.name !== doc.name
      ) {
         const postUrl = `https://${
            doc.site?.domain ? doc.site?.domain : `${doc.site.slug}.mana.wiki`
         }/p/${doc.slug}`;

         return await typesensePrivateClient
            .collections("posts")
            .documents()
            .upsert({
               id: doc.id,
               name: doc.name,
               category: "Post",
               ...(doc.subtitle && { subtitle: doc.subtitle }),
               url: postUrl,
               site: doc.site.id,
            });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
