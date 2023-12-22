import { GraphQLClient } from "graphql-request";

const authGraphQLClient = (siteSlug?: string) =>
   new GraphQLClient(gqlEndpoint({ siteSlug }), {
      ...(process.env.MANA_APP_KEY && {
         headers: {
            Authorization: `users API-Key ${process.env.MANA_APP_KEY}`,
         },
      }),
   });

export function gqlEndpoint({
   siteSlug,
}: {
   siteSlug?: string | undefined | null;
}) {
   //Custom sites
   if (siteSlug)
      return `https://${siteSlug}-db.${process.env.PAYLOAD_PUBLIC_HOST_DOMAIN}/api/graphql`;

   return process.env.NODE_ENV == "development"
      ? "http://localhost:3000/api/graphql"
      : `https://${process.env.PAYLOAD_PUBLIC_HOST_DOMAIN}/api/graphql`;
}

export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
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
}: {
   document?: any;
   variables?: any;
   siteSlug?: string;
}) {
   try {
      return authGraphQLClient(siteSlug).request(document, variables);
   } catch (err) {
      console.log(err);
   }
}
