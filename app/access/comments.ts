// Comment permissions
import type { Access, FieldAccess } from "payload/types";

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

export const isCommentDeletedField: FieldAccess = ({ doc }) => {
   if (doc?.isDeleted == true) return false;
   return true;
};
