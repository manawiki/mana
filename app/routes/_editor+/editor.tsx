import { useEffect, useState } from "react";

import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import type { Descendant } from "slate";
import { Slate } from "slate-react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import type { Config } from "payload/generated-types";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { useDebouncedValue, useIsMount } from "~/utils/use-debounce";

import { Toolbar } from "./core/components/Toolbar";
import { EditorWithDnD } from "./core/dnd";
import { useEditor } from "./core/plugins";
import { initialValue } from "./core/utils";

export function ManaEditor({
   fetcher,
   defaultValue,
   pageId,
   siteId,
   subSectionId,
   entryId,
   collectionEntity,
   collectionSlug,
   onChange,
}: {
   fetcher?: FetcherWithComponents<unknown>;
   defaultValue: unknown[];
   pageId?: string;
   siteId?: string;
   subSectionId?: string | undefined;
   entryId?: string | undefined | null;
   collectionEntity?: string;
   collectionSlug?: keyof Config["collections"];
   onChange?: (value: Descendant[]) => void;
}) {
   const editor = useEditor();

   //Prevent auto-saving on initial component mount
   const isMount = useIsMount();

   const [value, setValue] = useState(defaultValue);
   const debouncedValue = useDebouncedValue(value, 1000);

   useEffect(() => {
      if (!isMount && !onChange) {
         fetcher?.submit(
            //@ts-ignore
            {
               content: JSON.stringify(debouncedValue),
               intent: "update",
               siteId,
               pageId,
               collectionSlug,
               ...(entryId ? { entryId } : {}),
               ...(collectionEntity ? { collectionEntity } : {}),
               ...(subSectionId ? { subSectionId } : {}),
            },
            { method: "patch", action: "/editor" },
         );
      }
   }, [debouncedValue]);

   return (
      <Slate
         onChange={onChange ?? setValue}
         editor={editor}
         initialValue={(value as Descendant[]) ?? initialValue()}
      >
         <Toolbar />
         <EditorWithDnD editor={editor} />
      </Slate>
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

   if (!user)
      throw redirect("/login", {
         status: 302,
      });

   const { siteSlug } = await getSiteSlug(request, payload, user);

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
            case "postContents": {
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
               const { content } = await zx.parseForm(request, {
                  content: z.string(),
               });
               const { docs } = await payload.find({
                  collection: collectionSlug,
                  where: {
                     "site.slug": {
                        equals: siteSlug,
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
                  subSectionId,
                  entryId,
                  collectionEntity,
               } = await zx.parseForm(request, {
                  siteId: z.string(),
                  content: z.string(),
                  pageId: z.string(),
                  subSectionId: z.string().optional(),
                  entryId: z.string().optional(),
                  collectionEntity: z.string().optional(),
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
                     data: {
                        relationId: entryId,
                        site: siteId as any,
                        subSectionId,
                        //@ts-ignore
                        collectionEntity,
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
