import type { Params } from "@remix-run/react";
import type { Payload } from "payload";
import qs from "qs";

import type { RemixRequestContext } from "remix.env";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { gqlRequestWithCache } from "~/utils/cache.server";
import { authGQLFetcher, gqlEndpoint } from "~/utils/fetchers.server";

import { fetchListCore } from "./fetchListCore.server";

export interface ListFetchType {
   request: Request;
   payload: Payload;
   user?: RemixRequestContext["user"];
   params: Params;
   gql?: {
      query: string;
      variables?: {};
   };
}

export async function fetchList({
   request,
   gql,
   payload,
   user,
}: ListFetchType) {
   const { siteSlug } = await getSiteSlug(request, payload, user);
   const gqlPath = gqlEndpoint({
      siteSlug,
   });

   if (!gql) {
      const { entries } = await fetchListCore({
         request,
         payload,
         siteSlug,
         user,
      });
      return { entries };
   }

   const searchParams = new URL(request.url).search;

   const page = qs.parse(searchParams, { ignoreQueryPrefix: true })?.page;

   const data =
      gql?.query && !user
         ? await gqlRequestWithCache(gqlPath, gql?.query, {
              ...gql?.variables,
              page: parseInt(page as any),
           })
         : gql?.query &&
           (await authGQLFetcher({
              siteSlug: siteSlug,
              variables: {
                 ...gql?.variables,
                 page: parseInt(page as any),
              },
              document: gql?.query,
           }));

   return {
      list: {
         data,
      },
   };
}
