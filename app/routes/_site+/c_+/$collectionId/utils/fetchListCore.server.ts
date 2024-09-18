import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { cacheThis, gql } from "~/utils/cache.server";
import { gqlFormat, gqlFetch } from "~/utils/fetchers.server";

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
      const label = gqlFormat(collectionEntry?.slug as string, "list");

      const LIST_QUERY = gql`
         query {
            listData: ${label}(limit:12000) {
               totalDocs
               docs {
                  id
                  slug
                  name
                  icon {
                     id
                     url
                  }
               }
            }
         }
      `;

      //@ts-ignore
      const { listData } = await gqlFetch({
         isCustomDB: true,
         isCached: user ? false : true,
         query: LIST_QUERY,
         request,
      });

      if (listData) {
         return { listData: { docs: listData?.docs } };
      }
   }

   //Otherwise pull data from core
   const { docs: coreEntries } = user
      ? await payload.find({
           collection: "entries",
           where: {
              site: {
                 //@ts-ignore
                 equals: collectionEntry?.site.id,
              },
              "collectionEntity.slug": {
                 equals: collectionId,
              },
           },
           limit: 5000,
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
                       //@ts-ignore
                       equals: collectionEntry?.site.id,
                    },
                    "collectionEntity.slug": {
                       equals: collectionId,
                    },
                 },
                 limit: 5000,
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
         //@ts-ignore
         url: entry.icon?.url,
      },
   }));

   //Combine filtered docs with pagination info
   return { listData: { docs: filtered } };
}
