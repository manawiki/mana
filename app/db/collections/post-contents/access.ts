import type { Access } from "payload/types";

import { isSiteContributor } from "../../access/isSiteContributor";
import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";

export const canReadPostContent: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;

      //Singleton
      if (id) {
         const postContents = await payload.findByID({
            collection: "postContents",
            id,
            depth: 1,
         });
         const hasAccess = isSiteOwnerOrAdmin(user.id, postContents?.site);
         if (!hasAccess)
            return {
               _status: {
                  equals: "published",
               },
            };
         return hasAccess;
      }
      //List
      return {
         _status: {
            equals: "published",
         },
      };
   }
   //Anonymous users can only access published post contents
   return {
      _status: {
         equals: "published",
      },
   };
};

export const canCreatePostContent: Access = async ({
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

export const canUpdateOrDeletePostContent: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;

      const userId = user.id;

      if (id) {
         const postContents = await payload.findByID({
            collection: "postContents",
            id: id,
            depth: 1,
         });
         const hasAccess = isSiteOwnerOrAdmin(userId, postContents.site);

         // If the user is the author, they can delete their own post
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
