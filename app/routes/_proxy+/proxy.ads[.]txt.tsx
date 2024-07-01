import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

import { cacheThis } from "~/utils/cache.server";

export async function loader({ request }: LoaderFunctionArgs) {
   const url = "https://config.playwire.com/dyn_ads/1022828/70684/ads.txt";

   const body = await cacheThis(
      () => fetch(url).then((res) => res.text()),
      url,
      604800000,
   );
   return new Response(body, {
      headers: {
         "content-type": "text/plain",
         "Cache-Control": "public, max-age=604800, immutable",
      },
   });
}
