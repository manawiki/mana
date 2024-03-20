import { jsonToGraphQLQuery } from "json-to-graphql-query";
import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import type { Collection } from "~/db/payload-types";
import { cacheThis, gqlRequestWithCache } from "~/utils/cache.server";
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

      const query = {
         query: {
            entries: {
               __aliasFor: label,
               __args: {
                  limit: 200,
                  page: page,
                  sort: "number",
               },
               totalDocs: true,
               totalPages: true,
               limit: true,
               pagingCounter: true,
               hasPrevPage: true,
               prevPage: true,
               nextPage: true,
               hasNextPage: true,
               docs: {
                  id: true,
                  slug: true,
                  name: true,
                  icon: {
                     url: true,
                  },
               },
            },
         },
      };

      const graphql_query = jsonToGraphQLQuery(query, { pretty: true });

      const { entries } = user
         ? await authGQLFetcher({
              siteSlug: siteSlug,
              variables: {
                 page,
              },
              document: graphql_query,
           })
         : await gqlRequestWithCache(
              gqlEndpoint({ siteSlug: collectionEntry?.site.slug }),
              graphql_query,
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
