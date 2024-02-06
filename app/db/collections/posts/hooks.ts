import type { CollectionAfterDeleteHook } from "payload/types";

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
