import { request as gqlRequest } from "graphql-request";

import { apiDBPath, apiPath } from "./api-path.server";

export function gqlEndpoint({
   siteSlug,
}: {
   siteSlug?: string | undefined | null;
}) {
   let graphQLPath = "http://localhost:3000/api/graphql";

   //Custom sites
   if (siteSlug)
      graphQLPath = `https://${siteSlug}-db.${apiDBPath}/api/graphql`;

   if (process.env.NODE_ENV == "production")
      graphQLPath = `https://${apiPath}/api/graphql`;

   console.log("gqlEndpoint", graphQLPath);
   return graphQLPath;
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
   document,
   variables,
   siteSlug,
   request,
}: {
   document?: any;
   variables?: any;
   siteSlug?: string;
   request?: Request;
}) {
   try {
      return gqlRequest(gqlEndpoint({ siteSlug }), document, variables, {
         ...(request && {
            cookie: request?.headers.get("cookie") ?? "",
         }),
         ...(process.env.MANA_APP_KEY && {
            Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
         }),
      });
   } catch (err) {
      console.log(err);
   }
}

export { gqlFormat } from "./to-words";
