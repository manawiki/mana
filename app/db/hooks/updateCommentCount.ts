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
         const postParentId = doc.postParent.id;
         const currentCommentCount = await payload.findByID({
            collection: "posts",
            id: postParentId,
            depth: 0,
         });

         const updatedTotalComments = currentCommentCount?.totalComments
            ? currentCommentCount?.totalComments + 1
            : 1;
         await payload.update({
            collection: "posts",
            id: postParentId,
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
      const postParentId = doc.postParent.id;
      const currentCommentCount = await payload.findByID({
         collection: "posts",
         id: postParentId,
         depth: 0,
      });

      const updatedTotalComments = currentCommentCount?.totalComments
         ? currentCommentCount?.totalComments - 1
         : 1;

      await payload.update({
         collection: "posts",
         id: postParentId,
         data: {
            totalComments: updatedTotalComments,
         },
      });
   } catch (err: unknown) {
      payload.logger.error(`${err}`);
   }
};
