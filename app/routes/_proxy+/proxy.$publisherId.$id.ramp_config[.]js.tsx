// proxy the js response from https://cdn.intergient.com/publisherId/id/ramp_config.js to fix cors issue

import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

import { cacheThis } from "~/utils/cache.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
   const { publisherId, id } = params;

   invariant(publisherId, "publisherId is required");
   invariant(id, "id is required");

   const url = `https://cdn.intergient.com/${publisherId}/${id}/ramp_config.js`;

   const body = await cacheThis(
      () => fetch(url).then((res) => res.text()),
      url,
      604800,
   );

   return new Response(body, {
      headers: {
         "content-type": "application/javascript",
         "Cache-Control": "public, max-age=604800, immutable",
      },
   });
}
