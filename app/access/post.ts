import type { Access } from "payload/types";

import { isSiteOwnerOrAdmin } from "../db/collections/site/access";

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
