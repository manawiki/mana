import { Suspense, useEffect } from "react";

import { offset, shift } from "@floating-ui/react";
import { Float } from "@headlessui-float/react";
import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { deferIf } from "defer-if";
import type { Payload } from "payload";
import { select } from "payload-query";
import type { Descendant } from "slate";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import type { Post, Site, User } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { toast } from "~/components";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/modules/auth";
import { EditorCommandBar } from "~/routes/_editor+/core/components/EditorCommandBar";
import { EditorView } from "~/routes/_editor+/core/components/EditorView";
import { ManaEditor } from "~/routes/_editor+/editor";
import { isNativeSSR } from "~/utils";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const siteId = params?.siteId ?? customConfig?.siteId;

   const { page } = zx.parseQuery(request, {
      page: z.coerce.number().optional(),
   });

   const { p } = zx.parseParams(params, {
      p: z.string(),
   });

   const { isMobileApp } = isNativeSSR(request);

   const { post, isChanged, versions } = await fetchPost({
      p,
      page,
      payload,
      siteId,
      user,
   });

   return await deferIf({ post, isChanged, versions, siteId }, isMobileApp);
}

export default function Post() {
   const { post, isChanged } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   //Server response toast
   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data != null) {
         //@ts-ignore
         if (fetcher.data?.success) {
            //@ts-ignore
            toast.success(fetcher.data?.success);
         }
         //@ts-ignore
         if (fetcher.data?.error) {
            //@ts-ignore
            toast.error(fetcher.data?.error);
         }
      }
   }, [fetcher.state, fetcher.data]);

   return (
      <>
         {hasAccess ? (
            <Float
               middleware={[
                  shift({
                     padding: {
                        top: 80,
                     },
                  }),
                  offset({
                     mainAxis: 30,
                     crossAxis: 0,
                  }),
               ]}
               zIndex={20}
               autoUpdate
               placement="right-start"
               show
            >
               <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]">
                  <div className="relative min-h-screen">
                     <Suspense fallback="Loading...">
                        <Await resolve={post}>
                           <ManaEditor
                              collectionSlug="posts"
                              fetcher={fetcher}
                              pageId={post.id}
                              defaultValue={post.content as Descendant[]}
                           />
                        </Await>
                     </Suspense>
                  </div>
               </main>
               <div>
                  <EditorCommandBar
                     collectionSlug="posts"
                     pageId={post.id}
                     fetcher={fetcher}
                     isChanged={isChanged}
                  />
               </div>
            </Float>
         ) : (
            <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px]">
               <div className="relative min-h-screen">
                  <Suspense fallback="Loading...">
                     <Await resolve={post}>
                        <EditorView data={post.content} />
                     </Await>
                  </Suspense>
               </div>
            </main>
         )}
      </>
   );
}

async function fetchPost({
   p,
   payload,
   siteId,
   user,
   page = 1,
}: {
   p: string;
   payload: Payload;
   siteId: Site["slug"];
   user?: User;
   page: number | undefined;
}) {
   //Determine the real post Id from the post slug
   const { docs: postsAll } = await payload.find({
      collection: "posts",
      where: {
         "site.slug": {
            equals: siteId,
         },
         slug: {
            equals: p,
         },
      },
   });

   const post = postsAll[0];

   if (!user) {
      //If anon and data exists, return post data now
      if (post) {
         return { post };
      }
      //Attempt to fetch with ID
      if (!post) {
         const postById = await payload.findByID({
            collection: "posts",
            id: p,
         });

         if (!postById) throw redirect("/404", 404);

         //Post exists, we received the ID as a URL param and want to redirect to the canonical path instead.
         throw redirect(`/${postById.site.slug}/p/${postById.slug}`, 301);
      }
   }

   invariant(user, "Not logged in");

   //If post is not falsy, then we know the page was accessed with a canonical, as a site admin, we want to use the "/p/$p" path instead
   if (post) {
      throw redirect(`/${post.site.slug}/p/${post.id}`);
   }

   const authPost = await payload.findByID({
      collection: "posts",
      id: p,
      draft: true,
      user,
      overrideAccess: false,
   });

   const hasAccess = isSiteOwnerOrAdmin(user?.id, authPost.site);

   if (hasAccess) {
      const livePost = await payload.findByID({
         collection: "posts",
         id: p,
         user,
         overrideAccess: false,
      });
      const versionData = await payload.findVersions({
         collection: "posts",
         depth: 2,
         where: {
            parent: {
               equals: authPost.id,
            },
         },
         limit: 20,
         user,
         page,
      });
      const versions = versionData.docs
         .filter((doc) => doc.version._status === "published")
         .map((doc) => {
            const versionRow = select({ id: true, updatedAt: true }, doc);
            const version = select(
               {
                  id: false,
                  content: true,
                  _status: true,
               },
               doc.version,
            );

            //Combine final result
            const result = {
               ...versionRow,
               version,
            };

            return result;
         });

      const isChanged =
         JSON.stringify(authPost.content) != JSON.stringify(livePost.content);

      return { post: authPost, isChanged, versions };
   }
   return { post: authPost, isChanged: false };
}
