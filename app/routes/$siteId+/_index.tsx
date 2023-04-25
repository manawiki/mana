import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "~/liveblocks.config";
import { ForgeEditor } from "../$siteId.posts+/$postId+/edit/forge/Editor";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import { nanoid } from "nanoid";
import type { CustomElement } from "../$siteId.posts+/$postId+/edit/forge/types";
import { BlockType } from "../$siteId.posts+/$postId+/edit/forge/types";
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
import Block from "../$siteId.posts+/$postId+/edit/forge/blocks/Block";

import { HomeEdit } from "./HomeEdit";
import Leaf from "../$siteId.posts+/$postId+/edit/forge/blocks/Leaf";

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
      <main className="mx-auto max-w-[728px] max-desktop:px-4  max-laptop:pb-20 max-laptop:pt-10 laptop:pt-6">
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
                     <ClientSideSuspense
                        fallback={
                           <div className="mx-4 max-w-[728px] space-y-4 mobile:mx-auto">
                              <div
                                 className="bg-2 borer-color h-24
                         w-full animate-pulse rounded-lg"
                              />
                              <div
                                 className="bg-2 borer-color h-24
                         w-full animate-pulse rounded-lg"
                              />
                              <div
                                 className="bg-2 borer-color h-24
                         w-full animate-pulse rounded-lg"
                              />
                              <div
                                 className="bg-2 borer-color h-24
                         w-full animate-pulse rounded-lg"
                              />
                              <div
                                 className="bg-2 borer-color h-24
                         w-full animate-pulse rounded-lg"
                              />
                           </div>
                        }
                     >
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
