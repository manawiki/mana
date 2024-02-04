import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { cacheThis } from "~/utils/cache.server";

/**
 * Get the immutable post Id from post slug.
 * Cache if anon.
 */
export async function fetchPostWithSlug({
   p,
   payload,
   siteSlug,
   user,
}: {
   p: string;
   payload: Payload;
   siteSlug: string;
   user?: RemixRequestContext["user"];
}) {
   const { docs: postsAll } = !user
      ? await cacheThis(
           () =>
              payload.find({
                 collection: "posts",
                 where: {
                    "site.slug": {
                       equals: siteSlug,
                    },
                    slug: {
                       equals: p,
                    },
                 },
                 overrideAccess: false,
                 user,
              }),
           `post-${p}`,
        )
      : await payload.find({
           collection: "posts",
           where: {
              "site.slug": {
                 equals: siteSlug,
              },
              slug: {
                 equals: p,
              },
           },
           overrideAccess: false,
           user,
        });

   const post = postsAll[0];

   return { postData: post };
}
