import type { Payload } from "payload";
import { type Select } from "payload-query";

import type { Post, User } from "payload/generated-types";

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
   user?: User;
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

   const data = await payload.find({
      collection: "posts",
      where: {
         "site.slug": {
            equals: siteSlug,
         },
         publishedAt: {
            exists: true,
         },
         ...(q
            ? {
                 name: {
                    contains: q,
                 },
              }
            : {}),
      },
      depth: 2,
      overrideAccess: false,
      user,
      sort: "-publishedAt",
   });

   const { docs } = filterAuthorFields(data, postSelect);

   return { docs };
}
