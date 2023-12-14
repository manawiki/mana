import { settings } from "mana-config";

export function gqlEndpoint({
   siteSlug,
}: {
   siteSlug?: string | undefined | null;
}) {
   //Custom sites
   if (siteSlug && process.env.NODE_ENV == "production")
      return `https://${siteSlug}-db.${settings?.domain}/api/graphql`;
   if (siteSlug && process.env.NODE_ENV == "development")
      return "http://localhost:4000/api/graphql";

   //Core sites
   if (!siteSlug && process.env.NODE_ENV == "development")
      return "http://localhost:3000/api/graphql";

   return "https://mana.wiki/api/graphql";
}

export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
}
