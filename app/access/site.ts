import type { Site } from "payload/generated-types";
import type { Access } from "payload/types";

export const canReadPost: Access = async ({
   req: { user, payload },
   id: postId,
}) => {
   if (!user && postId) {
      const post = await payload.findByID({
         collection: "posts",
         id: postId,
         depth: 1,
      });
      if (post._status == "published") return true;
   }
   if (user && user.roles.includes("staff")) return true;
   if (user && postId) {
      const post = await payload.findByID({
         collection: "posts",
         id: postId,
         depth: 1,
      });
      const siteAdmins = (post.site as Site).admins;
      const userId = user.id;
      const isSiteOwner = userId == (post.site as Site).owner;
      const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
      if (isSiteOwner || isSiteAdmin) return true;
   }
   // Reject everyone else
   return false;
};

export const canMutateAsSiteAdmin =
   (collectionSlug: "collections" | "entries" | "posts"): Access =>
   async ({ req: { user, payload }, id: resultId, data }) => {
      if (user) {
         if (user.roles.includes("staff")) return true;
         const userId = user.id;
         // Update and Delete
         if (resultId) {
            const item = await payload.findByID({
               collection: collectionSlug,
               id: resultId,
               depth: 1,
            });
            //Check if user is a site owner or admin?
            const siteAdmins = (item.site as Site).admins;
            const isSiteOwner = userId == (item.site as Site).owner;
            const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
            if (isSiteOwner || isSiteAdmin) return true;
         }
         // Create
         if (data) {
            const site = await payload.findByID({
               collection: "sites",
               id: data.site,
               depth: 0,
            });
            //Check if user is a site owner or admin?
            const siteAdmins = site.admins;
            const isSiteOwner = userId == site.owner;
            const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
            if (isSiteOwner || isSiteAdmin) return true;
         }
      }
      // Reject everyone else
      return false;
   };
