import type { Access } from "payload/types";

import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";

export const canReadPost =
   (): Access =>
   async ({ req: { user, payload }, id }) => {
      if (!user)
         return {
            publishedAt: {
               exists: true,
            },
         };

      if (user && user.roles.includes("staff")) return true;

      //Singleton
      if (user && id) {
         const content = await payload.findByID({
            collection: "posts",
            id,
         });
         const hasAccess = isSiteOwnerOrAdmin(user.id, content?.site);
         if (!hasAccess)
            return {
               publishedAt: {
                  exists: true,
               },
            };
         return hasAccess;
      }
      //List
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
         return isSiteOwnerOrAdmin(userId, site);
      }
   }
   // Reject everyone else
   return false;
};

export const canUpdatePost: Access = async ({ req: { user, payload }, id }) => {
   if (user && id) {
      const application = await payload.findByID({
         collection: "siteApplications",
         id,
         depth: 1,
      });

      const hasAccess = isSiteOwnerOrAdmin(user.id, application.site);

      if (!hasAccess)
         return {
            createdBy: {
               equals: user.id,
            },
         };
      return hasAccess;
   }
   return {
      createdBy: {
         equals: user.id,
      },
   };
};
