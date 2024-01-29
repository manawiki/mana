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
         //If image belongs to site, check if user is owner or admin of site
         if (image && image.site) return isSiteOwnerOrAdmin(userId, image.site);
         //Otherwise, check if user is owner of image
         if (image) {
            return user.id === image.createdBy.id;
         }
      }
   }
   // Reject everyone else
   return false;
};
