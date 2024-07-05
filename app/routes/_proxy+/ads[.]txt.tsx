import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

import { cacheThis } from "~/utils/cache.server";

export async function loader({ request }: LoaderFunctionArgs) {
   const adsTxtURL =
      "https://config.playwire.com/dyn_ads/1025133/74686/ads.txt";

   const url = new URL(request.url);

   const hostname = url.hostname;

   const getRootDomain = (hostname: string) => {
      const parts = hostname.split(".").reverse();
      if (parts.length >= 2) {
         return `${parts[1]}.${parts[0]}`;
      }
      return hostname;
   };

   const ownerdomain = getRootDomain(hostname);

   const body = await cacheThis(
      () => fetch(adsTxtURL).then((res) => res.text()),
      adsTxtURL,
      604800000,
   );

   const updatedBody =
      ownerdomain == "mana.wiki"
         ? body
         : body.replace("ownerdomain=mana.wiki", `ownerdomain=${ownerdomain}`);

   return new Response(updatedBody, {
      headers: {
         "content-type": "text/plain",
         "Cache-Control": "public, max-age=86400",
      },
   });
}
