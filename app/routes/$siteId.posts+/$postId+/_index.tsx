import { Link, useLoaderData } from "@remix-run/react";
import { Suspense, useCallback, useMemo } from "react";
import type { V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { type LoaderArgs } from "@remix-run/node";

import { z } from "zod";
import { zx } from "zodix";

import {
   Editable,
   Slate,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { createEditor, type Descendant } from "slate";

import Block from "./edit/forge/blocks/Block";
import Leaf from "./edit/forge/blocks/Leaf";
import { PostHeader } from "./PostHeader";
import { ArrowLeft } from "lucide-react";
import { AdminOrStaffOrOwner } from "~/modules/auth";

//get notes list from payload
export async function loader({
   context: { payload, user },
   params,
}: LoaderArgs) {
   const { postId, siteId } = zx.parseParams(params, {
      postId: z.string(),
      siteId: z.string(),
   });
   const post = await payload.findByID({
      collection: "posts",
      id: postId,
      overrideAccess: false,
      user,
      depth: 2,
   });
   if (post._status != "published")
      throw redirect(`/${siteId}/posts/${postId}/edit`);
   return { post };
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "post",
};

export const meta: V2_MetaFunction = ({ data, parentsData }) => {
   const siteName = parentsData["routes/$siteId"].site.name;
   const postTitle = data.post.title;

   return [
      {
         title: `${postTitle} - ${siteName}`,
      },
   ];
};

export default function PostPage() {
   const editor = useMemo(() => withReact(createEditor()), []);
   const { post } = useLoaderData<typeof loader>();
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);

   return (
      <div>
         <AdminOrStaffOrOwner>
            <div className="flex justify-center z-10 fixed inset-x-0 mx-auto items-center w-full bottom-24 laptop:bottom-0">
               <Link
                  to="edit"
                  className="inline-flex justify-center w-36 flex-none items-center group laptop:border-b-0 bg-emerald-100 dark:border-emerald-900 
               gap-2 py-4 laptop:py-5 pr-5 pl-3 laptop:rounded-b-none rounded-2xl border shadow shadow-1 border-emerald-300 dark:bg-emerald-950"
               >
                  <ArrowLeft className="text-emerald-500" size={20} />
                  <div className="font-bold group-hover:underline dark:text-emerald-100 text-emerald-600">
                     Edit post
                  </div>
               </Link>
            </div>
         </AdminOrStaffOrOwner>
         <main>
            <div className="max-w-[728px] mx-auto max-desktop:px-3">
               <h1 className="font-header pt-8 laptop:pt-10 text-3xl laptop:text-4xl">
                  {post.title}
               </h1>
               <PostHeader post={post} />
            </div>
            {post?.banner && (
               <>
                  <section className="relative mb-5 max-w-[800px] mx-auto">
                     <div
                        className="bg-1 border-color flex aspect-[1.91/1] desktop:border 
                         laptop:rounded-none laptop:border-x-0 desktop:rounded-md
                         items-center justify-center overflow-hidden tablet:rounded-md
                         shadow-sm"
                     >
                        <img
                           alt="Post Banner"
                           className="h-full w-full object-cover"
                           //@ts-ignore
                           src={`https://mana.wiki/cdn-cgi/image/fit=crop,height=440,gravity=auto/${post?.banner?.url}`}
                        />
                     </div>
                  </section>
               </>
            )}
            <div className="max-w-[728px] mx-auto max-desktop:px-4">
               <Suspense fallback={<div>Loading...</div>}>
                  <Slate editor={editor} value={post.content as Descendant[]}>
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
