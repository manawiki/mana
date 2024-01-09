import { request as gqlRequest } from "graphql-request";

import { apiDBPath } from "~/utils/api-path.server";
import { fetchWithCache, gqlRequestWithCache } from "~/utils/cache.server";
import { authRestFetcher, gqlEndpoint } from "~/utils/fetchers.server";

import type { RestOrGraphql } from "./_entryTypes";
import { getEmbeddedContent } from "./getEmbeddedContent.server";
import { getEntryFields } from "./getEntryFields.server";

//Fetches all entry data.

export async function fetchEntry({
   payload,
   params,
   request,
   user,
   rest,
   gql,
}: RestOrGraphql) {
   const { entry } = await getEntryFields({
      payload,
      params,
      request,
      user,
   });

   const gqlPath = gqlEndpoint({
      siteSlug: entry.siteSlug,
   });

   const restPath = `https://${entry.siteSlug}-db.${apiDBPath}/api/${
      entry.collectionSlug
   }/${entry.id}?depth=${rest?.depth ?? 2}`;

   const GQLorREST = gql?.query
      ? user
         ? gqlRequest(gqlPath, gql?.query, {
              entryId: entry.id,
              ...gql?.variables,
           })
         : gqlRequestWithCache(gqlPath, gql?.query, {
              entryId: entry.id,
              ...gql?.variables,
           })
      : rest?.depth
        ? user
           ? authRestFetcher({ path: restPath, method: "GET" })
           : fetchWithCache(restPath)
        : undefined;

   const [data, embeddedContent] = await Promise.all([
      GQLorREST,
      getEmbeddedContent({
         id: entry.id as string,
         payload,
         params,
         request,
         user,
      }),
   ]);

   return {
      entry: {
         ...entry,
         embeddedContent,
         data,
      },
   };
}
