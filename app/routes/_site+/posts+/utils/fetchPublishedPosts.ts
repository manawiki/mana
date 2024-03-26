import type { Payload } from "payload";
import type { Select } from "payload-query";

import type { Post } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";
import { cacheThis } from "~/utils/cache.server";

import { filterAuthorFields } from "./filterAuthorFields";
import type { PostsAllSchema } from "../_posts";

export async function fetchPublishedPosts({
   q,
   payload,
   siteSlug,
   user,
}: typeof PostsAllSchema._type & {
   payload: Payload;
   siteSlug: string;
   user?: RemixRequestContext["user"];
}) {
   const postSelect: Select<Post> = {
      slug: true,
      name: true,
      author: true,
      publishedAt: true,
      updatedAt: true,
      subtitle: true,
      banner: true,
   };

   const data = user
      ? await payload.find({
           collection: "posts",
           where: {
              "site.slug": {
                 equals: siteSlug,
              },
              ...(q
                 ? {
                      name: {
                         contains: q,
                      },
                   }
                 : {}),
              and: [
                 {
                    publishedAt: {
                       exists: true,
                    },
                 },
                 {
                    publishedAt: {
                       not_equals: null,
                    },
                 },
              ],
           },
           depth: 2,
           overrideAccess: false,
           user,
           sort: "-publishedAt",
        })
      : await cacheThis(
           () =>
              payload.find({
                 collection: "posts",
                 where: {
                    "site.slug": {
                       equals: siteSlug,
                    },
                    ...(q
                       ? {
                            name: {
                               contains: q,
                            },
                         }
                       : {}),
                    and: [
                       {
                          publishedAt: {
                             exists: true,
                          },
                       },
                       {
                          publishedAt: {
                             not_equals: null,
                          },
                       },
                    ],
                 },
                 depth: 2,
                 overrideAccess: false,
                 user,
                 sort: "-publishedAt",
              }),
           `publishedPosts-${siteSlug}`,
        );
   const { docs } = filterAuthorFields(data, postSelect);

   return { docs };
}
