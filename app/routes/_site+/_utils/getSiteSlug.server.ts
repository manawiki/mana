import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { cacheThis } from "~/utils/cache.server";

/**
 * Retrieves the site slug based on the request object.
 * If the environment is development, it returns the default site slug.
 * Otherwise, it extracts the subdomain from the request's hostname and uses it as the site slug.
 * @param request - The request object containing the URL.
 * @returns An object containing the site slug.
 */
export async function getSiteSlug(
   request: Request,
   payload: Payload,
   user: RemixRequestContext["user"],
) {
   let siteSlug = process.env.SITE_SLUG ?? "hq";

   if (process.env.NODE_ENV == "development") return { siteSlug };

   let { hostname } = new URL(request.url);

   // check if hostname is a custom domain
   if (hostname !== "localhost") {
      const site = await cacheThis(
         () =>
            payload.find({
               collection: "sites",
               where: {
                  domain: {
                     equals: hostname,
                  },
               },
               overrideAccess: false,
               user,
               depth: 0,
            }),
         `sites-domain-${hostname}`,
         24 * 60 * 60 * 1000, // this changes rarely, so we can cache it for a day
      );

      if (site?.totalDocs == 1) {
         return {
            siteSlug: (site?.docs?.[0]?.slug as string) ?? "hq",
         };
      }
   }

   let [subDomain] = hostname.split(".");

   // Fixes the issue with fly.dev subdomains, make sure to define SITE_SLUG on fly secrets!
   if (subDomain && subDomain !== "localhost" && !hostname.includes("fly.dev"))
      siteSlug = subDomain;

   return {
      siteSlug,
   };
}
