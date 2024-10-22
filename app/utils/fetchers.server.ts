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
   isAuthOverride = false,
}: {
   document?: any;
   variables?: any;
   request?: Request;
   customPath?: string | undefined | null;
   isCustomDB?: boolean;
   isAuthOverride?: boolean;
}) {
   //If siteSlug is provided, it is querying the custom site endpoint
   try {
      return gqlRequest(
         gqlEndpoint({ customPath, isCustomDB }),
         document,
         variables,
         {
            //If the app key is set, we use it as the auth header, only MANA_APP_KEY or CUSTOM_DB_APP_KEY can be set, not both
            ...(request && !isAuthOverride
               ? { cookie: request?.headers.get("cookie") ?? "" }
               : {}),
            ...(isAuthOverride &&
            process.env.MANA_APP_KEY &&
            !process.env.CUSTOM_DB_APP_KEY
               ? { Authorization: `users API-Key ${process.env.MANA_APP_KEY}` }
               : {}),
            ...(isAuthOverride &&
            process.env.CUSTOM_DB_APP_KEY &&
            !process.env.MANA_APP_KEY
               ? {
                    Authorization: `users API-Key ${process.env.CUSTOM_DB_APP_KEY}`,
                 }
               : {}),
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
   isAuthOverride = false,
}: {
   query: string;
   request?: Request;
   isCustomDB?: boolean;
   customPath?: string | undefined | null;
   isCached: boolean;
   variables?: any;
   isAuthOverride?: boolean;
}) {
   return isCached
      ? await gqlRequestWithCache(
           gqlEndpoint({ isCustomDB, customPath }),
           query,
           variables,
           300_000,
           request,
           isAuthOverride,
        )
      : await authGQLFetcher({
           customPath,
           isCustomDB,
           document: query,
           request,
           variables,
           isAuthOverride,
        });
}

export function authRestFetcher({
   path,
   method,
   body,
   isAuthOverride = false,
}: {
   path: string;
   method: "PATCH" | "GET" | "DELETE" | "POST";
   body?: any;
   isAuthOverride?: boolean;
}) {
   try {
      return fetch(path, {
         method,
         ...(isAuthOverride &&
            process.env.MANA_APP_KEY &&
            !process.env.CUSTOM_DB_APP_KEY && {
               headers: {
                  Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
                  "Content-Type": "application/json",
               },
            }),
         ...(isAuthOverride &&
            process.env.CUSTOM_DB_APP_KEY &&
            !process.env.MANA_APP_KEY && {
               headers: {
                  Authorization: `users API-Key ${process.env.CUSTOM_DB_APP_KEY}`,
                  "Content-Type": "application/json",
               },
            }),
         ...(body &&
            (method == "PATCH" || method == "POST") && {
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
