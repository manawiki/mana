export function getSiteSlug(request: Request) {
   if (
      process.env.NODE_ENV == "development" &&
      process.env.PAYLOAD_PUBLIC_SITE_SLUG
   )
      return { siteSlug: process.env.PAYLOAD_PUBLIC_SITE_SLUG };
   let { hostname } = new URL(request.url);
   let [subDomain] = hostname.split(".");
   return { siteSlug: subDomain ?? "hq" };
}
