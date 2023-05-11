import type { Access, FieldAccess } from "payload/types";
import type { Site, User } from "payload/generated-types";
import invariant from "tiny-invariant";

export const isLoggedIn: Access = ({ req: { user } }) => {
   // Return true if user is logged in, false if not
   return Boolean(user);
};

export const isStaff: Access = ({ req: { user } }) => {
   // Return true or false based on if the user has a staff role
   return Boolean(user?.roles?.includes("staff"));
};

export const isStaffFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
   req: { user },
}) => {
   // Return true or false based on if the user has an staff role
   return Boolean(user?.roles?.includes("staff"));
};

export const isStaffOrSelf: Access = ({ req: { user } }) => {
   if (user) {
      if (user?.roles?.includes("staff")) {
         return true;
      }
      // If any other type of user, only provide access to themselves
      return {
         id: {
            equals: user.id,
         },
      };
   }
   // Reject everyone else
   return false;
};

export const canReadPost: Access = async ({
   req: { user, payload },
   id: postId,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      if (postId) {
         const post = await payload.findByID({
            collection: "posts",
            id: postId,
            depth: 1,
            draft: true,
         });
         if (post._status == "published") return true;
         const siteAdmins = (post.site as Site).admins;
         const userId = user.id;
         const isSiteOwner = userId == (post.site as Site).owner;
         const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
         if (isSiteOwner || isSiteAdmin) return true;
      }
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
         invariant(data);
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
      // Reject everyone else
      return false;
   };
