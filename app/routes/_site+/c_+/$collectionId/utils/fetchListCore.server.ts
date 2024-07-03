import type { Payload } from "payload";
import qs from "qs";

import type { RemixRequestContext } from "remix.env";
import { cacheThis, fetchWithCache } from "~/utils/cache.server";
import { authRestFetcher } from "~/utils/fetchers.server";

export async function fetchListCore({
   request,
   payload,
   siteSlug,
   user,
}: {
   request: Request;
   payload: Payload;
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
}) {
   const url = new URL(request.url).pathname;

   const collectionId = url.split("/")[2];

   const { docs: collectionData } = user
      ? await payload.find({
           collection: "collections",
           where: {
              "site.slug": {
                 equals: siteSlug,
              },
              slug: {
                 equals: collectionId,
              },
           },
           depth: 1,
           overrideAccess: false,
           user,
        })
      : await cacheThis(
           () =>
              payload.find({
                 collection: "collections",
                 where: {
                    "site.slug": {
                       equals: siteSlug,
                    },
                    slug: {
                       equals: collectionId,
                    },
                 },
                 depth: 1,
                 overrideAccess: false,
                 user,
              }),
           `list-collection-${siteSlug}-${collectionId}`,
        );

   const collectionEntry = collectionData[0];

   // Get custom collection list data
   if (collectionEntry?.customDatabase) {
      const searchParams = new URL(request.url).search;

      const page = qs.parse(searchParams, { ignoreQueryPrefix: true })?.page;

      const preparedQuery = `${page ? `&page=${page}` : ""}`;

      const restPath = `http://localhost:4000/api/${collectionEntry.slug}${
         preparedQuery ? `?${preparedQuery}&` : "?"
      }depth=1&limit=50`;

      const { docs, ...entryMetaData } = user
         ? await authRestFetcher({
              method: "GET",
              path: restPath,
           })
         : await fetchWithCache(restPath);

      const filteredDocs = docs.map((entry: any) => ({
         id: entry.id,
         name: entry.name,
         slug: entry.slug,
         icon: {
            url: entry.icon?.url,
         },
      }));
      return { entries: { docs: filteredDocs, ...entryMetaData } };
   }

   //Otherwise pull data from core
   const { docs: coreEntries, ...pagination } = user
      ? await payload.find({
           collection: "entries",
           where: {
              site: {
                 equals: collectionEntry?.site.id,
              },
              "collectionEntity.slug": {
                 equals: collectionId,
              },
           },
           depth: 1,
           overrideAccess: false,
           user,
        })
      : await cacheThis(
           () =>
              payload.find({
                 collection: "entries",
                 where: {
                    site: {
                       equals: collectionEntry?.site.id,
                    },
                    "collectionEntity.slug": {
                       equals: collectionId,
                    },
                 },
                 depth: 1,
                 overrideAccess: false,
                 user,
              }),
           `list-entries-${siteSlug}-${collectionId}`,
        );

   const filtered = coreEntries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      slug: entry.slug,
      icon: {
         url: entry.icon?.url,
      },
   }));

   //Combine filtered docs with pagination info
   const entries = { docs: filtered, ...pagination };

   return { entries };
}
