import { request as gqlRequest } from "graphql-request";

import { apiDBPath } from "./api-path.server";

export function gqlEndpoint({
   useProd,
   siteSlug,
}: {
   useProd?: boolean;
   siteSlug?: string | undefined | null;
}) {
   //Custom sites
   if (siteSlug)
      return process.env.NODE_ENV == "development" && !useProd
         ? "http://localhost:4000/api/graphql"
         : `https://${siteSlug}-db.${apiDBPath}/api/graphql`;

   return process.env.NODE_ENV == "development"
      ? "http://localhost:3000/api/graphql"
      : `https://${apiDBPath}/api/graphql`;
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

export function authGQLFetcher({
   useProd,
   document,
   variables,
   siteSlug,
   request,
}: {
   useProd?: boolean;
   document?: any;
   variables?: any;
   siteSlug?: string;
   request?: Request;
}) {
   try {
      return gqlRequest(
         gqlEndpoint({ siteSlug, useProd }),
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

export { gqlFormat } from "./to-words";
