import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { PaginatedDocs } from "payload/database";
import { z } from "zod";
import { zx } from "zodix";

import type { Post, PostTag } from "payload/generated-types";
import { Badge } from "~/components/Badge";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { cacheThis, gql, gqlRequestWithCache } from "~/utils/cache.server";
import { authGQLFetcher, gqlEndpoint } from "~/utils/fetchers.server";

import { PublishedPostRow } from "../../posts+/components/PublishedPostRow";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const POST_QUERY = gql`
      query ($tagId: JSON!) {
         posts: Posts(where: { tags: { equals: $tagId } }) {
            totalDocs
            docs {
               id
               slug
               name
               author {
                  username
                  avatar {
                     url
                  }
               }
               publishedAt
               updatedAt
               subtitle
               banner {
                  url
               }
            }
         }
      }
   `;

   const { tagSlug, tagType } = zx.parseParams(params, {
      tagSlug: z.string(),
      tagType: z.enum(["posts", "entries"]),
   });

   const getTag = user
      ? await payload.find({
           collection: "postTags",
           where: {
              slug: {
                 equals: tagSlug,
              },
              "site.slug": {
                 equals: siteSlug,
              },
           },
           depth: 0,
           overrideAccess: false,
           user,
        })
      : await cacheThis(
           () =>
              payload.find({
                 collection: "postTags",
                 where: {
                    slug: {
                       equals: tagSlug,
                    },
                    "site.slug": {
                       equals: siteSlug,
                    },
                 },
                 depth: 0,
                 overrideAccess: false,
                 user,
              }),
           `tag-${siteSlug}-${tagSlug}`,
        );

   if (getTag?.docs.length == 0) {
      throw new Response(null, {
         status: 404,
         statusText: "Not Found",
      });
   }

   const tag = getTag?.docs[0] as unknown as PostTag;

   const postData = user
      ? await authGQLFetcher({
           variables: { tagId: tag.id },
           document: POST_QUERY,
           request,
        })
      : await gqlRequestWithCache(gqlEndpoint({}), POST_QUERY, {
           tagId: tag.id,
        });

   const posts = (postData as any).posts as PaginatedDocs<Post>;

   return json({ tag, posts });
}

export default function Tags() {
   const { tag, posts } = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
         <div className="flex items-center justify-between pb-3">
            <h1 className="font-header text-2xl">
               <span className="text-1">#</span> {tag.name}
            </h1>
            <Badge>{posts.totalDocs} posts</Badge>
         </div>
         <section className="border-color divide-y overflow-hidden border-y dark:divide-zinc-700">
            {posts && posts?.totalDocs != 0 ? (
               posts.docs.map((post) => (
                  <PublishedPostRow key={post.id} post={post} />
               ))
            ) : (
               <div className="pt-4 pb-3">No published posts...</div>
            )}
         </section>
      </div>
   );
}

export const meta: MetaFunction<typeof loader, any> = ({ data, matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;

   //@ts-ignore
   const { name, slug } = data?.tag;

   const tagUrl = `/t/${slug}`;

   return [
      {
         title: `${name} - ${siteName}`,
      },
      {
         property: "og:title",
         content: `${name} - ${siteName}`,
      },
      { property: "og:site_name", content: siteName },
      ...(tagUrl ? [{ property: "og:url", content: tagUrl }] : []),
   ];
};
