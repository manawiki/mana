import { fetchWithCache } from "~/utils/cache.server";
import { authRestFetcher, gqlFetch } from "~/utils/fetchers.server";

import type { RestOrGraphql } from "./_entryTypes";
import { getEmbeddedContent } from "./getEmbeddedContent.server";
import { getEntryFields } from "./getEntryFields.server";

//Fetches all entry data.
export async function fetchEntry({
   isAuthOverride = false,
   payload,
   params,
   request,
   user,
   rest,
   gql,
}: RestOrGraphql & { isAuthOverride?: boolean }) {
   const { entry } = await getEntryFields({
      payload,
      params,
      request,
      user,
   });

   const restPath = `http://localhost:4000/api/${entry.collectionSlug}/${
      entry.id
   }?depth=${rest?.depth ?? 2}`;

   const GQLorREST = gql?.query
      ? await gqlFetch({
           isCustomDB: true,
           isCached: user ? false : true,
           query: gql?.query,
           request,
           customPath: undefined,
           isAuthOverride,
           variables: {
              entryId: entry.id,
              jsonEntryId: entry.id,
              ...gql?.variables,
           },
        })
      : rest?.depth
        ? user
           ? authRestFetcher({ path: restPath, method: "GET", isAuthOverride })
           : fetchWithCache(restPath, undefined, undefined, isAuthOverride)
        : undefined;

   const [data, embeddedContent] = await Promise.all([
      GQLorREST,
      getEmbeddedContent({
         id: entry.id as string,
         //@ts-ignore
         siteSlug: entry.siteSlug,
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
