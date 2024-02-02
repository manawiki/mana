// Comment permissions
import type { Access, FieldAccess } from "payload/types";
import invariant from "tiny-invariant";

import type { User } from "~/db/payload-types";

import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";

export const isOwnComment: Access = ({ req: { user } }) => {
   if (user) {
      return {
         author: {
            equals: user.id,
         },
      };
   }
   // Reject everyone else
   return false;
};

export const deleteComment: Access = async ({
   req: { user, payload },
   id: commentId,
}) => {
   if (user && commentId) {
      const comment = await payload.findByID({
         collection: "comments",
         id: commentId,
         depth: 0,
      });

      //Can delete own comment
      if (comment.author == user.id || user?.roles?.includes("staff")) {
         //If comment has no replies, it can be deleted
         if (!comment.replies || comment?.replies?.length == 0) {
            const getParentRelationField = await payload.find({
               collection: "comments",
               where: {
                  replies: {
                     equals: commentId,
                  },
               },
               depth: 0,
            });

            const parent = getParentRelationField?.docs[0];

            //If top level and no replies, delete
            if (!parent && comment.isTopLevel) {
               return true;
            }

            //Otherwise it's a nested reply and we need to prune the parent comment
            invariant(parent);

            let existingReplies =
               //@ts-ignore
               (parent.replies as string[]) ?? [];

            //Update parent to remove reply from relation field
            //@ts-ignore
            existingReplies.splice(existingReplies.indexOf(commentId), 1);

            await payload.update({
               collection: "comments",
               id: parent?.id,
               data: {
                  //@ts-ignore
                  replies: existingReplies,
               },
            });
            return true;
         }
         return false;
      }
   }
   // Reject everyone else
   return false;
};

export const isCommentDeletedField: FieldAccess = ({ doc }) => {
   if (doc?.isDeleted == true) return false;
   return true;
};

export const canMutateCommentsFieldAsSiteAdmin =
   (collectionSlug: "comments"): FieldAccess<{ id: string }, unknown, User> =>
   async ({ req: { user, payload }, id: resultId, data }) => {
      if (user) {
         if (user?.roles?.includes("staff")) return true;
         const userId = user.id;
         // Update and Delete
         if (resultId) {
            const item = await payload.findByID({
               collection: collectionSlug,
               id: resultId,
               depth: 1,
            });
            if (item.site) return isSiteOwnerOrAdmin(userId, item.site);
         }
      }
      // Reject everyone else
      return false;
   };
