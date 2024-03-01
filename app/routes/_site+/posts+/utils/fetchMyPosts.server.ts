import type { Payload } from "payload";
import type { Select } from "payload-query";

import type { Post } from "payload/generated-types";
import type { RemixRequestContext } from "remix.env";

import { filterAuthorFields } from "./filterAuthorFields";
import type { PostsAllSchema } from "../_posts";

export async function fetchMyPosts({
   status,
   page,
   payload,
   siteSlug,
   user,
}: typeof PostsAllSchema._type & {
   payload: Payload;
   siteSlug: string;
   user?: RemixRequestContext["user"];
}) {
   /**
    * --------------------------------------------------------
    * If authenticated, pull user's own posts (site-specific).
    * If no posts are returned:
    *    1) User doesn't have permission ["canRead"], so access check returns an empty array.
    *    2) User has no posts.
    * --------------------------------------------------------
    * If we get a result, we prune it before sending it to the client
    */
   if (user) {
      const data = await payload.find({
         collection: "posts",
         where: {
            "site.slug": {
               equals: siteSlug,
            },
            author: {
               equals: user.id,
            },
            ...(status == "published"
               ? {
                    publishedAt: {
                       exists: true,
                    },
                 }
               : status == "draft"
                 ? {
                      publishedAt: {
                         exists: false,
                      },
                   }
                 : {}),
         },
         page: page ?? 1,
         sort: "-updatedAt",
         depth: 2,
         overrideAccess: false,
         user,
      });

      const postSelect: Select<Post> = {
         name: true,
         updatedAt: true,
         publishedAt: true,
         slug: true,
      };

      const result = filterAuthorFields(data, postSelect);

      return result;
   }
   return;
}
