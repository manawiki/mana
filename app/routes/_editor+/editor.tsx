import { useEffect, useState } from "react";

import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { type Descendant } from "slate";
import { Slate } from "slate-react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import type { Config } from "payload/generated-types";

import { useDebouncedValue, useIsMount } from "~/utils";

import { Toolbar } from "./core/components/Toolbar";
import { EditorWithDnD } from "./core/dnd";
import { useEditor } from "./core/plugins";

export function ManaEditor({
   fetcher,
   defaultValue,
   siteId,
   pageId,
   sectionId,
   entryId,
   collectionEntity,
   collectionSlug,
}: {
   fetcher: FetcherWithComponents<never>;
   defaultValue: Descendant[];
   siteId?: string | undefined;
   pageId?: string;
   sectionId?: string;
   entryId?: string;
   collectionEntity?: string;
   collectionSlug?: keyof Config["collections"];
}) {
   const editor = useEditor();

   //Prevent auto-saving on initial component mount
   const isMount = useIsMount();

   const [value, setValue] = useState(defaultValue);
   const debouncedValue = useDebouncedValue(value, 1000);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            //@ts-ignore
            {
               content: JSON.stringify(debouncedValue),
               intent: "update",
               siteId,
               pageId,
               collectionSlug,
               collectionEntity,
               sectionId,
               entryId,
            },
            { method: "patch", action: "/editor" },
         );
      }
   }, [debouncedValue]);

   return (
      <div className="relative mx-auto max-w-[728px] pb-4">
         <Slate onChange={setValue} editor={editor} initialValue={value}>
            <Toolbar />
            <EditorWithDnD editor={editor} />
         </Slate>
      </div>
   );
}

export async function action({
   context: { payload, user },
   params,
   request,
}: ActionFunctionArgs) {
   const { intent, collectionSlug } = await zx.parseForm(request, {
      intent: z.enum(["update", "publish", "versionUpdate", "unpublish"]),
      collectionSlug: z.custom<keyof Config["collections"]>(),
   });

   if (!user) throw redirect("/login", { status: 302 });

   switch (intent) {
      case "versionUpdate": {
         const { versionId } = await zx.parseForm(request, {
            versionId: z.string(),
         });
         return await payload.restoreVersion({
            collection: collectionSlug,
            id: versionId,
            overrideAccess: false,
            user,
         });
      }
      case "update": {
         switch (collectionSlug) {
            case "posts": {
               const { content, pageId } = await zx.parseForm(request, {
                  content: z.string(),
                  pageId: z.string(),
               });
               return await payload.update({
                  collection: collectionSlug,
                  id: pageId,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }
            case "homeContents": {
               const { content, siteId } = await zx.parseForm(request, {
                  siteId: z.string(),
                  content: z.string(),
               });
               const { docs } = await payload.find({
                  collection: collectionSlug,
                  where: {
                     "site.slug": {
                        equals: siteId,
                     },
                  },
                  overrideAccess: false,
                  user,
               });
               invariant(docs[0]);
               return await payload.update({
                  collection: collectionSlug,
                  id: docs[0].id,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }
            case "contentEmbeds": {
               const {
                  siteId,
                  content,
                  pageId,
                  sectionId,
                  entryId,
                  collectionEntity,
               } = await zx.parseForm(request, {
                  siteId: z.string(),
                  content: z.string(),
                  pageId: z.string(),
                  sectionId: z.string(),
                  entryId: z.string(),
                  collectionEntity: z.string(),
               });

               try {
                  //If findById is not wrapped in a try catch, it'll throw and won't create
                  await payload.findByID({
                     collection: collectionSlug,
                     id: pageId,
                     overrideAccess: false,
                     user,
                  });

                  return await payload.update({
                     collection: collectionSlug,
                     id: pageId,
                     data: {
                        content: JSON.parse(content),
                     },
                     autosave: true,
                     draft: true,
                     overrideAccess: false,
                     user,
                  });
               } catch (error) {
                  return await payload.create({
                     collection: collectionSlug,
                     //@ts-ignore
                     data: {
                        relationId: entryId,
                        site: siteId as any,
                        sectionId: sectionId,
                        collectionEntity: collectionEntity as any,
                        content: JSON.parse(content),
                     },
                     user,
                     draft: true,
                     overrideAccess: false,
                  });
               }
            }
         }
      }
   }
}
