import type { Payload } from "payload";

import type { User } from "~/db/payload-types";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { gqlRequestWithCache } from "~/utils/cache.server";
import { authGQLFetcher, gqlEndpoint } from "~/utils/fetchers.server";

export interface ListFetchType {
   request: Request;
   payload: Payload;
   user: User | undefined;
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

   const data =
      gql?.query && !user
         ? await gqlRequestWithCache(gqlPath, gql?.query, {
              ...gql?.variables,
           })
         : gql?.query &&
           (await authGQLFetcher({
              siteSlug: siteSlug,
              variables: {
                 ...gql?.variables,
              },
              document: gql?.query,
           }));

   return {
      list: {
         data,
      },
   };
}
