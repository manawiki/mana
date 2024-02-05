import type { Access } from "payload/types";

import { isSiteContributor } from "../../access/isSiteContributor";
import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";

//@ts-ignore
//Don't understand why this is throwing an error
export const canReadPost: Access = async ({ req: { user, payload }, id }) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;

      //Singleton
      if (id) {
         const post = await payload.findByID({
            collection: "posts",
            id,
            depth: 1,
         });
         const hasAccess = isSiteOwnerOrAdmin(userId, post.site);
         //Contributors can only access their own posts
         if (!hasAccess)
            return {
               publishedAt: {
                  exists: true,
               },
            };
         return hasAccess;
      }
      //Auth List
      return {
         or: [
            {
               publishedAt: {
                  exists: true,
               },
            },
            {
               author: { equals: userId },
            },
         ],
      };
   }
   //Anonymous users can only access published posts
   return {
      publishedAt: {
         exists: true,
      },
   };
};

export const canCreatePost: Access = async ({
   req: { user, payload },
   data,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;

      if (data) {
         const site = await payload.findByID({
            collection: "sites",
            id: data.site,
            depth: 0,
         });
         const hasAccess =
            isSiteOwnerOrAdmin(userId, site) || isSiteContributor(userId, site);
         return hasAccess;
      }
   }
   // Reject everyone else
   return false;
};

export const canUpdateOrDeletePost: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;

      const userId = user.id;

      if (id) {
         const post = await payload.findByID({
            collection: "posts",
            id: id,
            depth: 1,
         });
         const hasAccess = isSiteOwnerOrAdmin(userId, post.site);

         // If the user is the author, they can delete or update their own post
         if (!hasAccess)
            return {
               author: {
                  equals: userId,
               },
            };
         return hasAccess;
      }
   }
   // Reject everyone else
   return false;
};
