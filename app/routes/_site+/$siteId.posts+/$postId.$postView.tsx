import { Suspense, useCallback, useMemo } from "react";

import {
   json,
   redirect,
   type MetaFunction,
   type LoaderArgs,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { createEditor, type Descendant } from "slate";
import {
   Editable,
   Slate,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Post } from "payload/generated-types";
import { Image } from "~/components/Image";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { EditorBlocks } from "~/routes/_editor+/blocks/Block";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import { fetchWithCache } from "~/utils/cache.server";

import { PostHeader } from "./components/PostHeader";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { postId, siteId, postView } = zx.parseParams(params, {
      postId: z.string(),
      siteId: z.string(),
      postView: z.string(),
   });
   try {
      const post = (await fetchWithCache(
         `${settings.domainFull}/api/posts/${postId}?depth=2`,
         {
            headers: {
               cookie: request.headers.get("cookie") ?? "",
            },
         }
      )) as Post;

      if (post._status == "draft") {
         throw json(null, { status: 404 });
      }
      //If slug does not equal slug saved in database, redirect to the correct slug

      if (post && postView != post.slug) {
         throw redirect(`/${siteId}/posts/${postId}/${post.slug}`, 301);
      }

      return json(
         { post, siteId },
         { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
      );
   } catch (e) {
      console.log(e);
      throw new Response("Internal Server Error", { status: 500 });
   }
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const meta: MetaFunction = ({ data, matches }) => {
   const siteName = matches.find(
      ({ id }) => id === "routes/_site+/$siteId+/_layout"
   )?.data?.site.name;
   const postTitle = data.post.name;
   const postDescription = data.post.subtitle;

   return [
      {
         title: `${postTitle} - ${siteName}`,
         description: postDescription,
      },
   ];
};

export default function PostPage() {
   const editor = useMemo(() => withReact(createEditor()), []);
   const { post, siteId } = useLoaderData<typeof loader>() || {};
   const renderElement = useCallback((props: RenderElementProps) => {
      return <EditorBlocks {...props} />;
   }, []);

   return (
      <div className="relative">
         <AdminOrStaffOrOwner>
            <div className="sticky top-[86px] flex items-center justify-center">
               <Link
                  to={`/${siteId}/posts/${post.id}/edit`}
                  className="shadow-1 group inline-flex w-36 flex-none items-center justify-center gap-2 rounded-2xl 
               border border-emerald-300 bg-emerald-100 py-4 pl-3 pr-5 shadow dark:border-emerald-900 dark:bg-emerald-950 laptop:rounded-t-none laptop:border-t-0"
               >
                  <ArrowLeft className="text-emerald-500" size={20} />
                  <div className="font-bold text-emerald-600 group-hover:underline dark:text-emerald-100">
                     Edit post
                  </div>
               </Link>
            </div>
         </AdminOrStaffOrOwner>
         <main>
            <div className="mx-auto max-w-[728px] max-desktop:px-3">
               <h1 className="font-header text-3xl !leading-[3rem] laptop:text-4xl">
                  {post.name}
               </h1>
               <PostHeader post={post} />
               {post.subtitle && (
                  <div className="text-1 border-color mb-5 border-b border-zinc-100 pb-3 text-sm font-semibold">
                     {post.subtitle}
                  </div>
               )}
            </div>
            {post?.banner && (
               <>
                  <section className="relative mx-auto mb-5 max-w-[800px]">
                     <div
                        className="bg-1 border-color flex aspect-[1.91/1] items-center 
                         justify-center overflow-hidden shadow-sm
                         tablet:rounded-md laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         desktop:border"
                     >
                        <Image
                           alt="Post Banner"
                           className="h-full w-full object-cover"
                           //@ts-ignore
                           options="height=440"
                           url={post?.banner?.url}
                        />
                     </div>
                  </section>
               </>
            )}
            <div className="mx-auto max-w-[728px] pb-8 max-desktop:px-3">
               <Suspense fallback={<div>Loading...</div>}>
                  <Slate
                     editor={editor}
                     initialValue={post.content as Descendant[]}
                  >
                     <Editable
                        renderElement={renderElement}
                        renderLeaf={Leaf}
                        readOnly={true}
                     />
                  </Slate>
               </Suspense>
            </div>
         </main>
      </div>
   );
}
