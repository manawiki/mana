import type { CollectionAfterDeleteHook } from "payload/types";

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
