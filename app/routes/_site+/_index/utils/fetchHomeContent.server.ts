import type { Payload } from "payload";
import { select } from "payload-query";
import qs from "qs";
import invariant from "tiny-invariant";

import type { HomeContent } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { isSiteOwnerOrAdmin } from "~/db/access/isSiteOwnerOrAdmin";
import { fetchWithCache } from "~/utils/cache.server";

export async function fetchHomeContent({
   payload,
   siteSlug,
   user,
   request,
   page = 1,
}: {
   payload: Payload;
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
   request: Request;
   page: number | undefined;
}) {
   //Use local API and bypass cache for logged in users
   if (user) {
      const { docs } = await payload.find({
         collection: "homeContents",
         where: {
            "site.slug": {
               equals: siteSlug,
            },
         },
         user,
      });

      const homeData = docs[0];
      invariant(homeData, "Site has no data");

      //If site admin, pull the latest draft and update isChanged
      //@ts-ignore
      const hasAccess = isSiteOwnerOrAdmin(user?.id, homeData.site);

      if (hasAccess) {
         const data = await payload.findByID({
            collection: "homeContents",
            id: homeData.id,
            depth: 1,
            draft: true,
            user,
         });

         //We disable perms since ID is not a paramater we can use, if above perms pass, we pull versions.
         const versionData = await payload.findVersions({
            collection: "homeContents",
            depth: 2,
            where: {
               parent: {
                  equals: homeData.id,
               },
            },
            limit: 20,
            user,
            page,
         });

         const versions = versionData.docs
            .filter((doc) => doc.version._status === "published")
            .map((doc) => {
               const versionRow = select({ id: true, updatedAt: true }, doc);
               const version = select(
                  {
                     id: false,
                     content: true,
                     author: true,
                     _status: true,
                  },
                  doc.version,
               );

               //Combine final result
               const result = {
                  ...versionRow,
                  version,
               };

               return result;
            });

         const home = select({ id: true, content: true }, data).content;

         const isChanged =
            JSON.stringify(home) != JSON.stringify(homeData.content);

         return { home, homeContentId: homeData.id, isChanged, versions };
      }

      //If no access, return content field from original query
      const home = docs[0]?.content;

      return { home, homeContentId: homeData.id, isChanged: false };
   }

   //For anon users, use cached endpoint call.
   const homeContentQuery = qs.stringify(
      {
         where: {
            "site.slug": {
               equals: siteSlug,
            },
         },
         select: {
            content: true,
         },
         depth: 1,
      },
      { addQueryPrefix: true },
   );

   const homeContentUrl = `${request.url}api/homeContents${homeContentQuery}`;

   const { docs } = await fetchWithCache(homeContentUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });

   const home = docs[0]?.content as HomeContent["content"];

   return { home, isChanged: false };
}
