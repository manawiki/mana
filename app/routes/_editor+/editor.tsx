import { useEffect, useState } from "react";

import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { type Descendant } from "slate";
import { Slate } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import { useDebouncedValue, useIsMount } from "~/hooks";

import { Toolbar } from "./core/components/Toolbar";
import { EditorWithDnD } from "./core/dnd";
import { useEditor } from "./core/plugins";

export function ManaEditor({
   fetcher,
   defaultValue,
   siteId,
   collectionEntity,
   pageId,
   sectionId,
   intent,
}: {
   fetcher: FetcherWithComponents<never>;
   defaultValue: Descendant[];
   siteId?: string | undefined;
   collectionEntity?: string;
   pageId?: string;
   sectionId?: string;
   intent?: string;
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
               intentType: "update",
               siteId,
               pageId,
               intent,
               collectionEntity,
               sectionId,
            },
            { method: "patch", action: "/editor" }
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
   request,
}: ActionFunctionArgs) {
   const { intent, intentType, siteId, pageId, collectionEntity, sectionId } =
      await zx.parseForm(request, {
         intent: z.string(),
         intentType: z.string(),
         siteId: z.string(),
         pageId: z.string().optional(),
         collectionEntity: z.string().optional(),
         sectionId: z.string().optional(),
      });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intentType) {
      case "update": {
         //Group of helper functions to get real id's from slug
         const slug = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteId,
               },
            },
            user,
         });
         const realSiteId = slug?.docs[0]?.id;

         const collectionSlug = await payload.find({
            collection: "collections",
            where: {
               slug: {
                  equals: collectionEntity,
               },
               site: {
                  equals: realSiteId,
               },
            },
            user,
         });

         const realCollectionId = collectionSlug?.docs[0]?.id;

         switch (intent) {
            case "customCollectionEmbed": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               const embedId = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: {
                        equals: realSiteId,
                     },
                     relationId: {
                        equals: pageId,
                     },
                     ...(collectionEntity
                        ? {
                             collectionEntity: {
                                equals: realCollectionId,
                             },
                          }
                        : {}),
                     ...(sectionId
                        ? {
                             sectionId: {
                                equals: sectionId,
                             },
                          }
                        : {}),
                  },
                  overrideAccess: false,
                  user,
               });

               //If existing embed doesn't exist, create a new one.
               if (embedId.totalDocs == 0) {
                  return await payload.create({
                     collection: "contentEmbeds",
                     //@ts-expect-error
                     data: {
                        content: JSON.parse(content),
                        relationId: pageId,
                        sectionId: sectionId,
                        site: realSiteId as any,
                        collectionEntity: realCollectionId as any,
                     },
                     draft: true,
                     overrideAccess: false,
                     user,
                  });
               }

               //Otherwise update the existing document
               return await payload.update({
                  collection: "contentEmbeds",
                  id: embedId.docs[0].id,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }

            case "homeContent": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               const homeContentId = await payload.find({
                  collection: "homeContents",
                  where: {
                     site: {
                        equals: realSiteId,
                     },
                  },
                  overrideAccess: false,
                  user,
               });

               //If existing embed doesn't exist, create a new one.
               if (homeContentId.totalDocs == 0) {
                  return await payload.create({
                     collection: "homeContents",
                     data: {
                        content: JSON.parse(content),
                        //@ts-expect-error
                        site: realSiteId,
                     },
                     draft: true,
                     overrideAccess: false,
                     user,
                  });
               }

               //Otherwise update the existing document
               return await payload.update({
                  collection: "homeContents",
                  id: homeContentId.docs[0].id,
                  data: {
                     content: JSON.parse(content),
                  },
                  autosave: true,
                  draft: true,
                  overrideAccess: false,
                  user,
               });
            }

            case "updatePostContent": {
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });

               //update the existing post
               return await payload.update({
                  collection: "posts",
                  //@ts-expect-error
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

            default:
               return null;
         }
      }
      case "publish": {
         switch (intent) {
            case "homeContent": {
               const homeContent = await payload.find({
                  collection: "homeContents",
                  where: {
                     "site.slug": {
                        equals: siteId,
                     },
                  },
                  overrideAccess: false,
                  user,
               });

               return await payload.update({
                  collection: "homeContents",
                  id: homeContent.docs[0].id,
                  data: {
                     _status: "published",
                  },
                  overrideAccess: false,
                  user,
               });
            }

            default:
               return null;
         }
      }
   }
}
