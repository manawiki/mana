import { useEffect, useMemo } from "react";

import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useMatches } from "@remix-run/react";
import { format } from "date-fns";
import { Loader2, Plus, Trash } from "lucide-react";
import { nanoid } from "nanoid";
import type { Descendant } from "slate";
import { Editor, createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import type { Update } from "payload/generated-types";
import customConfig from "~/_custom/config.json";
import { H2Default } from "~/modules/collections/components/H2";
import Block from "~/modules/editor/blocks/Block";
import Leaf from "~/modules/editor/blocks/Leaf";
import { Toolbar } from "~/modules/editor/components";
import { onKeyDown } from "~/modules/editor/editorCore";
import type { UpdatesElement } from "~/modules/editor/types";
import { UpdatesEditor } from "~/routes/_site+/$siteId+/blocks+/BlockUpdates/UpdatesEditor";
import { isAdding, isProcessing } from "~/utils";

type Props = {
   element: UpdatesElement;
};

const updatesInlineInitialValue = [
   {
      id: nanoid(),
      type: "updatesInline",
      children: [{ text: "" }],
   },
];

const dateFormat = (dateString: string) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
   }).format(new Date(dateString));

export const BlockUpdates = ({ element }: Props) => {
   //index presume to have results data, might be brittle in the future
   const { updateResults, siteId } = useMatches()?.[2]?.data as {
      updateResults: Update[];
      siteId: string;
   };

   const useEditor = () =>
      useMemo(() => withReact(withHistory(createEditor())), []);
   const editor = useEditor();
   editor.isInline = (element) => ["link"].includes(element.type);
   const fetcher = useFetcher();
   const disabled = isProcessing(fetcher.state);
   const addingUpdate = isAdding(fetcher, "createUpdate");
   const deletingUpdate = isAdding(fetcher, "deleteEntry");

   //Clear editor after update is added
   useEffect(() => {
      if (fetcher.data) {
         Transforms.delete(editor, {
            at: {
               anchor: Editor.start(editor, []),
               focus: Editor.end(editor, []),
            },
         });
      }
   }, [fetcher.data, editor]);

   return (
      <section>
         <>
            <H2Default text="Updates" />
            <div className="divide-color border-color bg-2 shadow-1 mb-5 divide-y overflow-hidden rounded-lg border shadow-sm">
               <div className="flex items-center justify-between gap-2 py-1 pr-2">
                  <span className="text-1 w-20 flex-none px-3 py-3.5 text-xs font-semibold uppercase">
                     {Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                     }).format(new Date())}
                  </span>
                  <div className="h-full w-full text-sm">
                     <Slate
                        editor={editor}
                        initialValue={updatesInlineInitialValue as Descendant[]}
                     >
                        <Toolbar />
                        <Editable
                           className="outline-none"
                           placeholder="Share an update..."
                           renderElement={Block}
                           renderLeaf={Leaf}
                           onKeyDown={(e) => onKeyDown(e, editor)}
                        />
                     </Slate>
                  </div>
                  <button
                     onClick={() => {
                        fetcher.submit(
                           {
                              data: JSON.stringify(editor.children),
                              intent: "createUpdate",
                           },
                           {
                              method: "post",
                              action: `/${siteId}/blocks/BlockUpdates`,
                           }
                        );
                     }}
                     disabled={disabled}
                     type="submit"
                  >
                     <div
                        className="shadow-1 font-bol inline-flex h-8 w-8 items-center justify-center rounded-xl 
                           border border-blue-200/80 bg-gradient-to-b from-blue-50
                           to-blue-100 text-xs font-bold
                           text-blue-500 shadow-sm transition dark:border-blue-900
                           dark:from-blue-950 dark:to-blue-950/80 dark:text-blue-200 
                           dark:shadow-blue-950"
                     >
                        {addingUpdate ? (
                           <Loader2 size={16} className="animate-spin" />
                        ) : (
                           <Plus size={18} />
                        )}
                     </div>
                  </button>
               </div>
               {updateResults?.map((row) => (
                  <section
                     key={row.id}
                     className="flex items-start gap-2 even:bg-white dark:even:bg-neutral-800/50"
                  >
                     <time
                        className="text-1 w-20 flex-none px-3 py-3.5 text-xs font-semibold uppercase"
                        dateTime={row?.createdAt}
                     >
                        {dateFormat(row?.createdAt)}
                     </time>
                     <span className="divide-color flex-grow divide-y text-sm">
                        {row.entry?.length === 0 ? (
                           <UpdatesEditor rowId={row.id} siteId={siteId} />
                        ) : (
                           <>
                              {row.entry?.map((item) => (
                                 <div
                                    key={item.id}
                                    className="group/updates relative py-3"
                                 >
                                    <UpdatesEditor
                                       rowId={row.id}
                                       entryId={item.id}
                                       siteId={siteId}
                                       blocks={item.content}
                                    />
                                    <button
                                       className="absolute right-3 top-3.5 hidden group-hover/updates:block"
                                       onClick={() =>
                                          fetcher.submit(
                                             //@ts-expect-error
                                             {
                                                entryId: item.id,
                                                updateId: row.id,
                                                intent: "deleteEntry",
                                             },
                                             {
                                                method: "DELETE",
                                                action: `/${siteId}/blocks/BlockUpdates`,
                                             }
                                          )
                                       }
                                       disabled={disabled}
                                       type="submit"
                                    >
                                       {deletingUpdate ? (
                                          <Loader2
                                             size={15}
                                             className="animate-spin"
                                          />
                                       ) : (
                                          <Trash
                                             className="text-zinc-400 hover:text-red-400"
                                             size={15}
                                          />
                                       )}
                                    </button>
                                 </div>
                              ))}
                           </>
                        )}
                     </span>
                  </section>
               ))}
            </div>
         </>
      </section>
   );
};

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const siteId = params?.siteId ?? customConfig?.siteId;

   switch (intent) {
      case "createUpdate": {
         const { data } = await zx.parseForm(request, {
            data: z.string(),
         });

         const newData = JSON.parse(data);
         const currentDate = format(new Date(), "MMM-dd-yy");

         const update = await payload.find({
            collection: "updates",
            where: {
               dateId: {
                  equals: currentDate,
               },
            },
            user,
         });

         //If no update with an existing day exists, we add as a new update
         if (update.totalDocs == 0) {
            const slug = await payload.find({
               collection: "sites",
               where: {
                  slug: {
                     equals: siteId,
                  },
               },
               user,
            });
            const site = slug?.docs[0];
            return await payload.create({
               collection: "updates",
               data: {
                  site: site.id,
                  dateId: currentDate,
                  entry: [
                     {
                        content: newData,
                     },
                  ],
               },
               overrideAccess: false,
               user,
            });
         }

         //Otherwise add entry to an existing update on the same day
         const updateId = update.docs[0].id;
         const entryData = update.docs[0].entry;

         return await payload.update({
            collection: "updates",
            id: updateId,
            data: {
               entry: [{ content: newData }, ...entryData],
            },
            overrideAccess: false,
            user,
         });
      }
      case "deleteEntry": {
         const { entryId, updateId } = await zx.parseForm(request, {
            entryId: z.string(),
            updateId: z.string(),
         });

         const existingData = await payload.findByID({
            collection: "updates",
            id: updateId,
            user,
         });

         const entryData = existingData.entry;

         //Prepare new array that doesn't include deleted entry
         const updatedData = entryData?.filter((item) => item.id !== entryId);

         //If last entry, we delete the entire update instead
         if (updatedData?.length == 0) {
            return await payload.delete({
               collection: "updates",
               id: updateId,
               overrideAccess: false,
               user,
            });
         }
         //Otherwise we only delete the associated sub-entry
         return await payload.update({
            collection: "updates",
            id: updateId,
            data: {
               entry: updatedData ?? {},
            },
            overrideAccess: false,
            user,
         });
      }
      case "updateEntry": {
         const { content, rowId, entryId } = await zx.parseForm(request, {
            content: z.string(),
            rowId: z.string(),
            entryId: z.string().optional(),
         });

         const updateData = await payload.findByID({
            collection: "updates",
            id: rowId,
            user,
         });

         const entryData = updateData.entry;

         //Update nested entry content for particular date
         const updatedData = entryData?.map((x) =>
            x.id === entryId ? { ...x, content: JSON.parse(content) } : x
         );

         return await payload.update({
            collection: "updates",
            id: rowId,
            data: {
               entry: updatedData ?? {},
            },
            overrideAccess: false,
            user,
         });
      }
   }
};
