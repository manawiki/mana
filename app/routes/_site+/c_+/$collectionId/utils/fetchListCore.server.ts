import type { Payload } from "payload";
import { select } from "payload-query";

import type { User, Collection } from "~/db/payload-types";
import { cacheThis, gql, gqlRequestWithCache } from "~/utils/cache.server";
import { gqlFormat, gqlEndpoint } from "~/utils/fetchers.server";

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
   siteSlug: string;
   user?: User;
}) {
   const collectionData = await cacheThis(
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
            overrideAccess: false,
            user,
         }),
      `list-collection-${siteSlug}-${collectionId}`,
   );

   const collectionEntry = collectionData?.docs[0];

   // Get custom collection list data
   if (collectionEntry?.customDatabase) {
      const label = gqlFormat(collectionId, "list");

      const document = gql`
         query($page: Int!) {
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

      const endpoint = gqlEndpoint({ siteSlug: collectionEntry?.site.slug });

      const { entries }: any = await gqlRequestWithCache(endpoint, document, {
         page,
      });
      return { entries };
   }

   //Otherwise pull data from core
   const data = await cacheThis(
      () =>
         payload.find({
            collection: "entries",
            where: {
               site: {
                  equals: collectionEntry?.site?.id,
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

   const filtered = data.docs.map((doc) => {
      return {
         ...select(
            {
               id: true,
               name: true,
               slug: true,
            },
            doc,
         ),
         icon: doc.icon && select({ id: false, url: true }, doc.icon),
      };
   });

   //Extract pagination fields
   const { docs, ...pagination } = data;

   //Combine filtered docs with pagination info
   const result = { docs: filtered, ...pagination };

   return { entries: result };
}
