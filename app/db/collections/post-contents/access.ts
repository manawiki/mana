import type { Access } from "payload/types";

import { isSiteContributor } from "../../access/isSiteContributor";
import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";

//@ts-ignore
//Don't understand why this is throwing an error
export const canReadPostContent: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;

      //Singleton
      if (id) {
         const postContents = await payload.findByID({
            collection: "postContents",
            id,
            depth: 1,
         });
         //Admins and owners can access any post content
         const hasAccess = isSiteOwnerOrAdmin(user.id, postContents?.site);
         //Contributors can only access their own or published post contents
         if (!hasAccess)
            return {
               or: [
                  {
                     _status: {
                        equals: "published",
                     },
                  },
                  {
                     author: { equals: userId },
                  },
               ],
            };
         return hasAccess;
      }
      //Auth List
      return {
         or: [
            {
               _status: {
                  equals: "published",
               },
            },
            {
               author: { equals: userId },
            },
         ],
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
            isSiteOwnerOrAdmin(userId, site) ||
            isSiteContributor(userId, site?.contributors as any[]);

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
