import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import type { loader as siteLayoutLoader } from "~/routes/_site+/_layout";
import { getSiteSlug } from "../_utils/getSiteSlug.server";
import { json, useLoaderData } from "@remix-run/react";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { gqlFetch, gqlFormat } from "~/utils/fetchers.server";
import { gql } from "graphql-request";
import { cacheThis } from "~/utils/cache.server";
import { Image } from "~/components/Image";
import { Comment } from "~/db/payload-types";
import { Icon } from "~/components/Icon";
import { Link } from "@remix-run/react";

import { format, formatDistanceStrict } from "date-fns";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const getSite = await cacheThis(
      () =>
         payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteSlug,
               },
            },
            depth: 0,
         }),
      `sites-slug-${siteSlug}`,
   );

   const siteId = getSite?.docs?.[0]?.id;

   const { comments } = await gqlFetch({
      isCustomDB: false,
      isCached: true,
      query: COMMENTS_QUERY,
      request,
      variables: { siteId },
   });

   const parentIdsBySlug = comments.docs.reduce(
      (acc, comment) => {
         const slug = comment.parentSlug;
         acc[slug] = acc[slug] || {};
         acc[slug][comment.parentId] = true;
         return acc;
      },
      {} as Record<string, Record<string, boolean>>,
   );

   const getParentQuery = (slug: string) =>
      slug === "posts"
         ? PARENT_DATA_QUERY
         : gql`
            query ($parentIds: [String!]) {
               docs: ${gqlFormat(
                  slug,
                  "list",
               )}(where: { id: { in: $parentIds } }) {
                  docs {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
               }
            }
         `;

   const parentData = await Promise.all(
      Object.entries(parentIdsBySlug).map(([slug, idsObj]) =>
         gqlFetch({
            isCustomDB: slug !== "posts",
            isCached: true,
            query: getParentQuery(slug),
            request,
            variables: { parentIds: Object.keys(idsObj) },
         }),
      ),
   );

   const parentMap = new Map(
      parentData.flatMap(
         (data, index) =>
            data.docs?.docs?.map((item: any) => [
               item.id,
               {
                  id: item.id,
                  title: item.name,
                  icon: item.icon?.url,
                  slug:
                     Object.keys(parentIdsBySlug)[index] === "posts"
                        ? `/p/${item.slug}`
                        : `/c/${Object.keys(parentIdsBySlug)[index]}/${
                             item.slug
                          }`,
               },
            ]) ?? [],
      ),
   );

   const enhancedComments = comments.docs.map((comment) => ({
      ...comment,
      parent: parentMap.get(comment.parentId) || {
         title: null,
         icon: null,
         slug: null,
      },
   }));

   return json({ comments: enhancedComments });
}

export const meta: MetaFunction<
   null,
   {
      "routes/_site+/_layout": typeof siteLayoutLoader;
   }
> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;
   return [
      {
         title: `Community - ${siteName}`,
      },
   ];
};

export default function PostList() {
   const { comments } = useLoaderData<typeof loader>();
   console.log(comments);
   return (
      <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-3 laptop:pt-6">
         <div className="">
            {comments.length > 0 ? (
               <>
                  <div className="flex items-center gap-2 font-bold pb-2 font-header pl-0.5">
                     <Icon
                        size={16}
                        className="text-1"
                        name="message-circle"
                        title="Latest Sitewide Comments"
                     />
                     <span>Latest Comments</span>
                  </div>
                  <div className="divide-y divide-color-sub border-y border-color-sub">
                     {comments.map((comment: Comment) => (
                        <div key={comment.id} className="pt-4 pb-4">
                           <Link
                              to={`${comment.parent.slug}#${comment.id}`}
                              className="flex text-xs text-1 font-semibold hover:text-zinc-800 dark:hover:text-zinc-200 
                              dark:decoration-zinc-600 items-center gap-2 underline underline-offset-4 decoration-zinc-200"
                           >
                              {comment.parent.title}
                           </Link>
                           <div className="flex items-start gap-1 pt-3 pl-0.5 text-sm">
                              <Icon
                                 name="corner-down-right"
                                 className="text-1"
                                 size={14}
                              />
                              <EditorView data={comment.comment} />
                           </div>
                           <div className="flex items-center gap-3 pl-6">
                              <div className="flex items-center gap-1.5">
                                 <Image
                                    className="rounded-full size-4"
                                    width={32}
                                    height={32}
                                    url={comment?.author?.avatar?.url}
                                    alt={comment?.author?.username ?? ""}
                                 />
                                 <span className="text-xs text-1">
                                    {comment?.author?.username}
                                 </span>
                              </div>
                              <span className="size-1 rounded-full dark:bg-dark500 bg-zinc-300" />
                              <span className="text-xs text-1">
                                 {formatDistanceStrict(
                                    new Date(comment.updatedAt),
                                    new Date(),
                                    { addSuffix: true },
                                 )}
                              </span>
                              {comment?.upVotesStatic &&
                                 comment.upVotesStatic > 0 && (
                                    <>
                                       <span className="size-1 rounded-full dark:bg-dark500 bg-zinc-300" />
                                       <div className="flex items-center gap-2">
                                          <div>
                                             <Icon
                                                name="triangle"
                                                title="Up Vote"
                                                className="text-emerald-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                                size={10}
                                             />
                                          </div>
                                          <span className="text-xs">
                                             {comment.upVotesStatic}
                                          </span>
                                       </div>
                                    </>
                                 )}
                           </div>
                        </div>
                     ))}
                  </div>
               </>
            ) : (
               "No comments yet"
            )}
         </div>
      </main>
   );
}

const COMMENTS_QUERY = gql`
   query ($siteId: JSON!) {
      comments: Comments(
         where: { site: { equals: $siteId } }
         sort: "-updatedAt"
      ) {
         docs {
            id
            comment
            updatedAt
            upVotesStatic
            parentId
            parentSlug
            author {
               username
               avatar {
                  url
               }
            }
         }
      }
   }
`;

const PARENT_DATA_QUERY = gql`
   query ($parentIds: [String!]) {
      docs: Posts(where: { id: { in: $parentIds } }) {
         docs {
            id
            name
            slug
         }
      }
   }
`;
