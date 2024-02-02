// proxy the js response from https://cdn.intergient.com/ramp_core.js to fix cors issue

import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

import { cacheThis } from "~/utils/cache.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
   const url = "https://cdn.intergient.com/ramp_core.js";

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
