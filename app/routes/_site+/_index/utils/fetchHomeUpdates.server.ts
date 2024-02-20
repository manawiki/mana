import type { Payload } from "payload";
import type { Select } from "payload-query";
import { select } from "payload-query";
import qs from "qs";

import type { Update } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { fetchWithCache } from "~/utils/cache.server";

export async function fetchHomeUpdates({
   payload,
   siteSlug,
   user,
   request,
}: {
   payload: Payload;
   siteSlug: string | undefined;
   user?: RemixRequestContext["user"];
   request: Request;
}): Promise<Update[]> {
   if (user) {
      const { docs } = await payload.find({
         collection: "updates",
         where: {
            "site.slug": {
               equals: siteSlug,
            },
         },
         sort: "-createdAt",
         depth: 0,
         user,
      });

      const select2: Select<Update> = { entry: true, createdAt: true };

      const selectUpdateResults = select(select2);

      //@ts-expect-error
      return docs.map((doc) => selectUpdateResults(doc));
   }

   const updatesQuery = qs.stringify(
      {
         where: {
            "site.slug": {
               equals: siteSlug,
            },
         },
         select: {
            entry: true,
            createdAt: true,
         },
         sort: "-createdAt",
      },
      { addQueryPrefix: true },
   );

   const updatesUrl = `${request.url}api/updates${updatesQuery}`;

   const { docs: updateResults } = await fetchWithCache(updatesUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   });
   return updateResults;
}
