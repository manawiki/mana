import type { Payload } from "payload";

import type { User } from "~/db/payload-types";

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
   user: User | undefined,
) {
   let siteSlug = process.env.PAYLOAD_PUBLIC_SITE_SLUG ?? "hq";

   if (process.env.NODE_ENV == "development") return { siteSlug };

   let { hostname } = new URL(request.url);

   const site = await payload.find({
      collection: "sites",
      where: {
         domain: {
            equals: hostname,
         },
      },
      overrideAccess: false,
      user,
      depth: 0,
   });

   if (site?.totalDocs == 1) {
      return {
         siteSlug: site.docs[0]?.slug ?? "hq",
      };
   }

   let [subDomain] = hostname.split(".");

   if (subDomain && subDomain !== "localhost") siteSlug = subDomain;
   return {
      siteSlug,
   };
}
