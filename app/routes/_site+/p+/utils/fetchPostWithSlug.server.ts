import { redirect } from "@remix-run/node";
import type { Payload } from "payload";

import type { RemixRequestContext } from "remix.env";
import { cacheThis } from "~/utils/cache.server";

export interface PostData {
   id: string;
   name: string;
   createdAt: string | Date;
   subtitle?: string;
   updatedAt?: string | Date;
   slug?: string;
   publishedAt?: Date;
   content: {
      content?: string;
   };
   banner?: {
      url: string;
   };
   author: {
      id: string;
      username?: string;
      avatar?: {
         url: string;
      };
   };
   site: {
      id: string;
      admins?: string[];
      contributors?: string[];
      enableAds?: boolean;
      owner: string;
   };
   maxCommentDepth?: number;
   totalComments?: number;
}

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
                 depth: 2,
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
           depth: 2,
        });

   const fullPost = postsAll[0];

   if (!fullPost) throw redirect("/404", 404);

   const post = {
      id: fullPost.id,
      name: fullPost.name,
      createdAt: fullPost.createdAt,
      subtitle: fullPost?.subtitle,
      updatedAt: fullPost?.updatedAt,
      slug: fullPost?.slug,
      publishedAt: fullPost?.publishedAt,
      content: {
         content: fullPost?.content?.content,
      },
      ...(fullPost?.banner?.url && {
         banner: {
            url: fullPost?.banner?.url,
         },
      }),
      author: {
         id: fullPost?.author.id,
         username: fullPost?.author?.username,
         avatar: {
            url: fullPost?.author?.avatar?.url,
         },
      },
      site: {
         id: fullPost?.site.id,
         admins: fullPost?.site.admins,
         contributors: fullPost?.site.contributors,
         enableAds: fullPost?.site.enableAds,
         owner: fullPost?.site.owner,
      },
      maxCommentDepth: fullPost?.maxCommentDepth,
      totalComments: fullPost?.totalComments,
   };

   return { postData: post };
}
