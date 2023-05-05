import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "~/liveblocks.config";
import { ForgeEditor } from "~/modules/editor/Editor";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import { nanoid } from "nanoid";
import type { CustomElement } from "~/modules/editor/types";
import { BlockType } from "~/modules/editor/types";
import { useLoaderData } from "@remix-run/react";
import {
   AdminOrStaffOrOwner,
   useIsStaffOrSiteAdminOrStaffOrOwner,
} from "~/modules/auth";
import { Suspense, useCallback, useMemo } from "react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import type { RenderElementProps } from "slate-react";
import { Slate, Editable, withReact } from "slate-react";
import Block from "~/modules/editor/blocks/Block";
import { Image } from "~/components";
import { HomeEdit } from "./HomeEdit";
import Leaf from "~/modules/editor/blocks/Leaf";
import { Component, Twitter } from "lucide-react";
import Tooltip from "~/components/Tooltip";
import { PostSkeletonLoader } from "~/components/PostSkeletonLoader";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const siteData = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteId,
         },
      },
      user,
   });

   const site = siteData?.docs[0];

   return { site };
}

const initialValue: CustomElement[] = [
   {
      id: nanoid(),
      type: BlockType.Paragraph,
      children: [
         {
            text: "",
         },
      ],
   },
];

export default function SiteIndexMain() {
   const { site } = useLoaderData<typeof loader>();
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   return (
      <>
         {site.banner ? (
            <div
               style={{
                  backgroundImage: `url(https://mana.wiki/cdn-cgi/image/gravity=auto,height=500/${site.banner?.url})`,
               }}
               className="border-color relative -mt-16 h-60 overflow-hidden border-b border-zinc-100 bg-cover bg-center laptop:h-72"
            >
               <div
                  className="absolute left-0 top-0 
            h-full w-full bg-gradient-to-b 
            from-zinc-50 via-transparent to-white dark:from-bg3Dark/20  dark:to-bg3Dark"
               ></div>
               <div
                  className="absolute left-0 top-0 
            h-full w-full bg-gradient-to-r 
            from-white via-transparent to-white dark:from-bg3Dark dark:via-transparent  dark:to-bg3Dark"
               ></div>
            </div>
         ) : (
            <div className="border-color relative -mt-16 h-60 overflow-hidden border-b border-zinc-100 bg-cover bg-center laptop:h-72">
               <div
                  className="pattern-opacity-50 pattern-wavy absolute
                   left-0 top-0
                     h-full w-full pattern-bg-white pattern-zinc-200 
                     pattern-size-6 dark:pattern-zinc-800 dark:pattern-bg-zinc-900"
               />
            </div>
         )}

         <div className="relative mx-auto -mt-10 h-20 max-w-[728px] max-desktop:px-3">
            <div className="shadow-1 absolute left-0 top-0 h-20 w-20 overflow-hidden rounded-full shadow max-desktop:left-3">
               <Image
                  //@ts-expect-error
                  url={site.icon?.url}
                  options="height=200"
                  alt="Site Icon"
               />
            </div>
         </div>
         <div className="relative z-10 mx-auto -mt-[52px] max-w-[728px] max-desktop:px-3">
            <div className="flex flex-row-reverse py-3">
               <div className="border-color bg-2 shadow-1 rounded-b-lg border border-t-0 px-3 py-2 shadow-sm">
                  <Tooltip id="group-color" side="top" content="Pages">
                     <div className="flex items-center gap-2">
                        <Component size={14} />
                        <div className="text-1">1k+</div>
                     </div>
                  </Tooltip>
               </div>
            </div>
         </div>
         <main className="mx-auto max-w-[728px] pb-20 pt-4 max-desktop:px-3">
            {hasAccess ? (
               <AdminOrStaffOrOwner>
                  <div className="relative min-h-screen leading-7">
                     <RoomProvider
                        id={site.id}
                        initialStorage={{
                           blocks: new LiveList(initialValue),
                        }}
                        initialPresence={{
                           selectedBlockId: null,
                        }}
                     >
                        <ClientSideSuspense fallback={<PostSkeletonLoader />}>
                           {() => (
                              <>
                                 <HomeEdit site={site} />
                                 <ForgeEditor />
                              </>
                           )}
                        </ClientSideSuspense>
                     </RoomProvider>
                  </div>
               </AdminOrStaffOrOwner>
            ) : (
               <>
                  {site.content && (
                     <Suspense fallback={<div>Loading...</div>}>
                        <Slate
                           editor={editor}
                           value={site.content as Descendant[]}
                        >
                           <Editable
                              renderElement={renderElement}
                              renderLeaf={Leaf}
                              readOnly={true}
                           />
                        </Slate>
                     </Suspense>
                  )}
               </>
            )}
         </main>
      </>
   );
}

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "update": {
         const siteData = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            overrideAccess: false,
            user,
         });

         const site = siteData?.docs[0];

         // Get data from liveblocks then save to MongoDB
         const result = await (
            await fetch(
               `https://api.liveblocks.io/v2/rooms/${site.id}/storage`,
               {
                  headers: {
                     Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
                  },
               }
            )
         ).json();

         const data = result.data.blocks.data;

         return await payload.update({
            collection: "sites",
            id: site.id,
            data: {
               content: data,
            },
            overrideAccess: false,
            user,
         });
      }

      default:
         return null;
   }
}
