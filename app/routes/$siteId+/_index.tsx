import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import { nanoid } from "nanoid";
import type { CustomElement } from "~/modules/editor/types";
import { BlockType } from "~/modules/editor/types";
import { useLoaderData, useParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { createEditor } from "slate";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import type { HomeContent } from "payload/generated-types";
import { SoloEditor } from "../editors+/SoloEditor";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import {
   AdminOrStaffOrOwner,
   useIsStaffOrSiteAdminOrStaffOrOwner,
} from "~/modules/auth";
import {
   Slate,
   Editable,
   withReact,
   type RenderElementProps,
} from "slate-react";
import { Site } from "payload-types";

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

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const url = new URL(request.url).origin;
   const homeContentUrl = `${url}/api/homeContents?where[site.slug][equals]=${siteId}&depth=1`;
   const { docs: data } = (await (
      await fetch(homeContentUrl, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })
   ).json()) as PaginatedDocs<HomeContent>;

   const homeData = data[0];
   //We need to append the draft paramater to the url if editing
   const siteAdmins = (homeData.site as Site).admins;
   const userId = user?.id;
   const isSiteOwner = userId == (homeData.site as Site).owner;
   const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
   if (isSiteOwner || isSiteAdmin) {
      const editHomeContentUrl = `${url}/api/homeContents?where[site.slug][equals]=${siteId}&depth=0&draft=true`;
      const { docs: data } = (await (
         await fetch(editHomeContentUrl, {
            headers: {
               cookie: request.headers.get("cookie") ?? "",
            },
         })
      ).json()) as PaginatedDocs<HomeContent>;
      const home = data[0].content;
      return json({ home });
   }

   //Otherwise return json and cache
   const home = data[0].content;
   return json(
      { home },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
   );
}

export default function SiteIndexMain() {
   const { home } = useLoaderData<typeof loader>();
   const editor = useMemo(() => withReact(createEditor()), []);
   const renderElement = useCallback((props: RenderElementProps) => {
      return <Block {...props} />;
   }, []);
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();
   const { siteId } = useParams();
   console.log(home);
   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3">
            {hasAccess ? (
               <AdminOrStaffOrOwner>
                  <div className="relative min-h-screen pt-20 laptop:pt-12">
                     <SoloEditor
                        key={siteId}
                        siteId={siteId}
                        intent="homeContent"
                        defaultValue={home != undefined ? home : initialValue}
                     />
                  </div>
               </AdminOrStaffOrOwner>
            ) : (
               <>
                  {home && (
                     <div className="pt-20 max-desktop:px-3 laptop:pt-12">
                        <Slate key={siteId} editor={editor} value={home}>
                           <Editable
                              renderElement={renderElement}
                              renderLeaf={Leaf}
                              readOnly={true}
                           />
                        </Slate>
                     </div>
                  )}
               </>
            )}
         </main>
      </>
   );
}
