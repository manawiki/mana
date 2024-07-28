import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

import { typesensePrivateClient } from "~/utils/typsense.server";

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
      const bannerId = doc.banner.id;

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
      if (doc.status === "published") {
         const content = doc.content;

         return await typesensePrivateClient
            .collections("posts")
            .documents()
            .upsert({
               id: doc.id,
               url: doc.url,
               site: doc.site,
               content: doc.content,
            });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
