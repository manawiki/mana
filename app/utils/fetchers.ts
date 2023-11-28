import { settings } from "mana-config";

//todo we should add a case for when the siteSlug is undefined
export function gqlEndpoint({
   siteSlug,
}: {
   siteSlug: string | undefined | null;
}) {
   return `https://${siteSlug}-db.${settings?.domain}/api/graphql`;
}
export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
}
