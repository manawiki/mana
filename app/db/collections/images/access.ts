import type { Access } from "payload/types";

import { isSiteOwnerOrAdmin } from "../site/access";

export const canDeleteImages: Access = async ({
   req: { user, payload },
   id: resultId,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;
      if (resultId) {
         const image = await payload.findByID({
            collection: "images",
            id: resultId,
            depth: 1,
         });
         if (image) return isSiteOwnerOrAdmin(userId, image.site);
      }
   }
   // Reject everyone else
   return false;
};
