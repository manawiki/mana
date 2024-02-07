// proxy the js response from https://www.googletagmanager.com/gtag/js?id=G-${gtag}
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

import { cacheThis } from "~/utils/cache.server";

export async function loader({ request }: LoaderFunctionArgs) {
   const url =
      "https://www.googletagmanager.com/gtag/js" + new URL(request.url).search;

   const body = await cacheThis(
      () => fetch(url).then((res) => res.text()),
      url,
      604800000,
   );
   return new Response(body, {
      headers: {
         "content-type": "application/javascript",
         "Cache-Control": "public, max-age=604800, immutable",
      },
   });
}
