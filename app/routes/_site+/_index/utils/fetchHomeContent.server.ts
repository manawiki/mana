import type { Payload } from "payload";
import { select } from "payload-query";
import qs from "qs";
import invariant from "tiny-invariant";

import type { HomeContent } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { isSiteAdmin } from "~/db/access/isSiteAdmin";
import { isSiteOwner } from "~/db/access/isSiteOwner";
import { isSiteOwnerOrAdmin } from "~/db/access/isSiteOwnerOrAdmin";
import { fetchWithCache, gql } from "~/utils/cache.server";
import { gqlFetch } from "~/utils/fetchers.server";

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
   const sites = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      user,
      overrideAccess: false,
      depth: 0,
   });

   const site = sites?.docs[0];

   const isOwner = isSiteOwner(user?.id, site?.owner as any);
   const isAdmin = isSiteAdmin(user?.id, site?.admins as any[]);
   //Use local API and bypass cache for logged in users
   if (isOwner || isAdmin) {
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

   //@ts-ignore
   const { homeContents } = await gqlFetch({
      isCustomDB: false,
      isCached: isOwner || isAdmin ? false : true,
      query: HOME_CONTENT_QUERY,
      request,
      variables: {
         siteId: site?.id,
         updatesPage: page,
      },
   });

   const home = homeContents.docs[0]?.content as HomeContent["content"];

   return { home, isChanged: false };
}

const HOME_CONTENT_QUERY = gql`
   query ($updatesPage: Int, $siteId: JSON!) {
      homeContents: HomeContents(
         where: { site: { equals: $siteId } }
         limit: 1
         sort: "-createdAt"
         page: $updatesPage
      ) {
         docs {
            content
         }
      }
   }
`;
