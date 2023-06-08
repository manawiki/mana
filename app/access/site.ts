import type { Site } from "payload/generated-types";
import type { Access } from "payload/types";

export const canRead =
   (
      collectionSlug:
         | "collections"
         | "entries"
         | "posts"
         | "updates"
         | "homeContents"
   ): Access =>
   async ({ req: { user, payload }, id }) => {
      if (user && user.roles.includes("staff")) return true;
      if (user && collectionSlug) {
         const content = await payload.findByID({
            collection: collectionSlug,
            id,
         });
         //show if staff or site admin
         const siteAdmins = (content.site as Site).admins;
         const userId = user.id;
         const isSiteOwner = userId == (content.site as Site).owner;
         const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
         if (isSiteOwner || isSiteAdmin) return true;
      }
      // otherwise only return if published
      return {
         _status: {
            equals: "published",
         },
      };
   };

export const canMutateAsSiteAdmin =
   (
      collectionSlug:
         | "collections"
         | "entries"
         | "posts"
         | "updates"
         | "homeContents"
   ): Access =>
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
