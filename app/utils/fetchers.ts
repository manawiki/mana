import { settings } from "mana-config";
import type { Site } from "~/db/payload-types";

export function gqlEndpoint({ siteSlug }: { siteSlug: Site["slug"] }) {
   return `https://${siteSlug}-db.${settings?.domain}/api/graphql`;
}
export function swrRestFetcher(...args: any) {
   return fetch(args).then((res) => res.json());
}
