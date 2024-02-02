import type { Access } from "payload/types";

import { isSiteOwnerOrAdmin } from "../db/collections/sites/access";

export const canRead =
   (
      collectionSlug:
         | "collections"
         | "entries"
         | "updates"
         | "homeContents"
         | "contentEmbeds"
         | "comments"
         | "postContents",
   ): Access =>
   async ({ req: { user, payload }, id }) => {
      if (user && user.roles.includes("staff")) return true;
      if (user && collectionSlug && id) {
         const content = await payload.findByID({
            collection: collectionSlug,
            id,
         });
         if (content.site) return isSiteOwnerOrAdmin(user.id, content.site);
      }
      /**
       * If there is no user,
       * restrict the documents that are returned
       * to only those where `_status` is equal to `published`
       * or where `_status` does not exist
       * */
      return {
         or: [
            {
               _status: {
                  equals: "published",
               },
            },
            {
               _status: {
                  exists: false,
               },
            },
         ],
      };
   };
