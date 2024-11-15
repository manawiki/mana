import type {
   CollectionAfterChangeHook,
   CollectionAfterDeleteHook,
} from "payload/types";

export const updateCommentCount: CollectionAfterChangeHook = async ({
   doc,
   req: { payload },
   operation,
}) => {
   try {
      if (operation == "create") {
         const parentId = doc.parentId;
         const parentSlug = doc.parentSlug;

         const currentCommentCount = await payload.findByID({
            collection: parentSlug,
            id: parentId,
            depth: 0,
         });

         const updatedTotalComments = currentCommentCount?.totalComments
            ? currentCommentCount?.totalComments + 1
            : 1;
         await payload.update({
            collection: parentSlug,
            id: parentId,
            data: {
               totalComments: updatedTotalComments,
            },
         });
      }
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};

export const updateCommentCountAfterDelete: CollectionAfterDeleteHook = async ({
   doc,
   req: { payload },
}) => {
   try {
      const parentId = doc.parentId;
      const parentSlug = doc.parentSlug;

      const currentCommentCount = await payload.findByID({
         collection: parentSlug,
         id: parentId,
         depth: 0,
      });

      const updatedTotalComments = currentCommentCount?.totalComments
         ? currentCommentCount?.totalComments - 1
         : 1;

      await payload.update({
         collection: parentSlug,
         id: parentId,
         data: {
            totalComments: updatedTotalComments,
         },
      });
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
