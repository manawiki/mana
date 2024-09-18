import { request as gqlRequest } from "graphql-request";

import { gqlRequestWithCache } from "./cache.server";

export function gqlEndpoint({
   customPath,
   isCustomDB,
}: {
   customPath?: string | undefined | null;
   isCustomDB?: boolean;
}) {
   //External host custom DB
   if (customPath) return customPath;

   //Internal host custom DB
   if (isCustomDB) return "http://localhost:4000/api/graphql";

   //Internal host core DB
   return "http://localhost:3000/api/graphql";
}

export function authGQLFetcher({
   document,
   variables,
   request,
   customPath,
   isCustomDB,
}: {
   document?: any;
   variables?: any;
   request?: Request;
   customPath?: string | undefined | null;
   isCustomDB?: boolean;
}) {
   //If siteSlug is provided, it is querying the custom site endpoint
   try {
      return gqlRequest(
         gqlEndpoint({ customPath, isCustomDB }),
         document,
         variables,
         {
            ...(request && {
               cookie: request?.headers.get("cookie") ?? "",
            }),
            ...(process.env.MANA_APP_KEY && {
               Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
            }),
         },
      );
   } catch (err) {
      console.log(err);
   }
}

export async function gqlFetch({
   query,
   request,
   isCustomDB,
   isCached,
   customPath,
   variables,
}: {
   query: string;
   request?: Request;
   isCustomDB?: boolean;
   customPath?: string | undefined | null;
   isCached: boolean;
   variables?: any;
}) {
   return isCached
      ? await gqlRequestWithCache(
           gqlEndpoint({ isCustomDB, customPath }),
           query,
           variables,
        )
      : await authGQLFetcher({
           customPath,
           isCustomDB,
           document: query,
           request,
           variables,
        });
}

export function authRestFetcher({
   path,
   method,
   body,
}: {
   path: string;
   method: "PATCH" | "GET";
   body?: any;
}) {
   try {
      return fetch(path, {
         method,
         ...(process.env.MANA_APP_KEY && {
            headers: {
               Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
               "Content-Type": "application/json",
               // connection: "keep-alive",
            },
         }),
         ...(body &&
            method == "PATCH" && {
               body: JSON.stringify({
                  ...body,
               }),
            }),
      }).then((res) => res.json());
   } catch (err) {
      console.log(err);
   }
}

export { gqlFormat } from "./to-words";
