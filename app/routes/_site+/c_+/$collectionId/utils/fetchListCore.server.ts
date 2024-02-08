import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import type { Collection } from "~/db/payload-types";
import { cacheThis, gql, gqlRequestWithCache } from "~/utils/cache.server";
import {
   gqlFormat,
   gqlEndpoint,
   authGQLFetcher,
} from "~/utils/fetchers.server";

import type { CollectionsAllSchema } from "../_list";

export async function fetchListCore({
   page = 1,
   payload,
   siteSlug,
   user,
   collectionId,
}: typeof CollectionsAllSchema._type & {
   payload: Payload;
   collectionId: Collection["slug"];
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
}) {
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
      const label = gqlFormat(collectionId, "list");

      const document = gql`
         query ($page: Int!) {
            entries: ${label}(page: $page, limit: 20) {
               totalDocs
               totalPages
               limit
               pagingCounter
               hasPrevPage
               prevPage
               nextPage
               hasNextPage
               docs {
                  id
                  name
                  icon {
                     url
                  }
               }
            }
         }
      `;

      const { entries } = user
         ? await authGQLFetcher({
              siteSlug: siteSlug,
              variables: {
                 page,
              },
              document: document,
           })
         : await gqlRequestWithCache(
              gqlEndpoint({ siteSlug: collectionEntry?.site.slug }),
              document,
              {
                 page,
              },
           );

      return { entries };
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
