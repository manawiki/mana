import type { Params } from "@remix-run/react";
import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { gqlFetch } from "~/utils/fetchers.server";

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

   if (!gql) {
      return await fetchListCore({
         request,
         payload,
         siteSlug,
         user,
      });
   }

   return (
      gql?.query &&
      (await gqlFetch({
         isCustomDB: true,
         isCached: user ? false : true,
         query: gql?.query,
         request,
         variables: { ...gql?.variables },
      }))
   );
}
