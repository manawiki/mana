import { useEffect, useMemo, useState } from "react";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useMatches } from "@remix-run/react";
import dt from "date-and-time";
import { nanoid } from "nanoid";
import type { Descendant } from "slate";
import { Editor, createEditor, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";
import { z } from "zod";
import { zx } from "zodix";

import type { Update } from "payload/generated-types";
import { Button } from "~/components/Button";
import { H2Plain } from "~/components/Headers";
import { Icon } from "~/components/Icon";
// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";
import { withLinkify } from "~/routes/_editor+/core/plugins/link/withLinkify";
import { initialValue, onKeyDown } from "~/routes/_editor+/core/utils";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { isAdding, isProcessing } from "~/utils/form";
import { useDebouncedValue, useIsMount } from "~/utils/use-debounce";

import { Toolbar } from "../../core/components/Toolbar";
import type { UpdatesElement, CustomElement } from "../../core/types";

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

export function BlockUpdates({ element }: Props) {
   //index presume to have results data, might be brittle in the future
   const { updateResults, siteId } = useMatches()?.[2]?.data as {
      updateResults: Update[];
      siteId: string;
   };

   const editor = useMemo(
      () => withLinkify(withReact(withHistory(createEditor()))),
      [],
   );
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
            <H2Plain text="Updates" />
            <div className="divide-color-sub border-color-sub bg-3 shadow-1 mb-5 divide-y overflow-hidden rounded-lg border shadow-sm">
               <div className="flex items-center justify-between bg-zinc-50 py-1 pr-2.5 dark:bg-dark350">
                  <span className="text-1 w-20 flex-none px-3 py-3.5 text-xs font-semibold uppercase">
                     {Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        timeZone: "America/Los_Angeles",
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
                           renderElement={EditorBlocks}
                           renderLeaf={Leaf}
                           onKeyDown={(e) => onKeyDown(e, editor)}
                        />
                     </Slate>
                  </div>
                  <Button
                     onClick={() => {
                        fetcher.submit(
                           {
                              data: JSON.stringify(editor.children),
                              intent: "createUpdate",
                           },
                           {
                              method: "post",
                              action: `/blocks/updates`,
                           },
                        );
                     }}
                     disabled={disabled}
                     type="submit"
                  >
                     {addingUpdate ? (
                        <Icon
                           name="loader-2"
                           size={16}
                           className="animate-spin"
                        />
                     ) : (
                        <>
                           <Icon name="send" size={12} />
                           Post
                        </>
                     )}
                  </Button>
               </div>
               {updateResults?.map((row) => (
                  <section
                     key={row.id}
                     className="flex items-start odd:bg-zinc-50  dark:odd:bg-dark350"
                  >
                     <time
                        suppressHydrationWarning
                        className="text-1 w-20 flex-none px-3 py-3.5 text-xs font-semibold uppercase"
                        dateTime={row?.createdAt}
                     >
                        {new Date(row?.createdAt).toLocaleDateString("en-US", {
                           month: "short",
                           day: "numeric",
                           timeZone: "America/Los_Angeles",
                        })}
                     </time>
                     <span className="divide-color flex-grow divide-y text-sm min-w-0">
                        {row.entry?.length === 0 ? (
                           <UpdatesEditor rowId={row.id} siteId={siteId} />
                        ) : (
                           <>
                              {row.entry?.map((item) => (
                                 <div
                                    key={item.id}
                                    className="group/updates relative pl-0 p-3"
                                 >
                                    <UpdatesEditor
                                       rowId={row.id}
                                       entryId={item.id!}
                                       siteId={siteId}
                                       blocks={item.content as CustomElement[]}
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
                                                action: `/blocks/updates`,
                                             },
                                          )
                                       }
                                       disabled={disabled}
                                       type="submit"
                                    >
                                       {deletingUpdate ? (
                                          <Icon
                                             name="loader-2"
                                             size={15}
                                             className="animate-spin"
                                          />
                                       ) : (
                                          <Icon
                                             name="trash"
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
            {/* <div className="flex items-center gap-2 justify-between pt-2">
               <div className="flex items-center gap-1 text-sm">
                  <span className="text-1">Page</span>
                  <div className="flex items-center gap-1">
                     <span className="font-semibold">
                        {table.getState().pagination.pageIndex + 1}
                     </span>
                     <span className="text-1">of</span>
                     <span className="font-semibold">
                        {table.getPageCount().toLocaleString()}
                     </span>
                  </div>
                  <span className="mx-1 size-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
                  <div className="flex items-center gap-1">
                     <span>{table.getRowCount().toLocaleString()}</span>
                     <span className="text-1">results</span>
                  </div>
               </div>
               <div className="flex items-center gap-1">
                  <Button
                     outline
                     className="!size-7 !p-0"
                     onClick={() => table.firstPage()}
                     disabled={!table.getCanPreviousPage()}
                  >
                     <Icon name="chevrons-left" size={16} />
                  </Button>
                  <Button
                     className="!size-7 !p-0"
                     outline
                     onClick={() => table.previousPage()}
                     disabled={!table.getCanPreviousPage()}
                  >
                     <Icon name="chevron-left" size={16} />
                  </Button>
                  <Button
                     className="!size-7 !p-0"
                     outline
                     onClick={() => table.nextPage()}
                     disabled={!table.getCanNextPage()}
                  >
                     <Icon name="chevron-right" size={16} />
                  </Button>
                  <Button
                     className="!size-7 !p-0"
                     outline
                     onClick={() => table.lastPage()}
                     disabled={!table.getCanNextPage()}
                  >
                     <Icon name="chevrons-right" size={16} />
                  </Button>
               </div>
            </div> */}
         </>
      </section>
   );
}

export const action = async ({
   context: { payload, user },
   request,
   params,
}: LoaderFunctionArgs) => {
   if (!user || !user.id) throw redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const { siteSlug } = await getSiteSlug(request, payload, user);

   switch (intent) {
      case "createUpdate": {
         const { data } = await zx.parseForm(request, {
            data: z.string(),
         });

         const newData = JSON.parse(data);
         const currentDate = dt.format(new Date(), "MMM-DD-YYYY");

         const update = await payload.find({
            collection: "updates",
            where: {
               dateId: {
                  equals: currentDate,
               },
               "site.slug": {
                  equals: siteSlug,
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
                     equals: siteSlug,
                  },
               },
               user,
            });
            const site = slug?.docs[0];
            return await payload.create({
               collection: "updates",
               data: {
                  //@ts-expect-error
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
         const updateId = update?.docs[0]?.id;
         const entryData = update?.docs[0]?.entry;

         return await payload.update({
            collection: "updates",
            id: updateId as any,
            data: {
               //@ts-ignore
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
         //@ts-ignore
         const updatedData = entryData?.filter(
            (item: any) => item.id !== entryId,
         );

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
         //@ts-ignore
         const updatedData = entryData?.map((x) =>
            x.id === entryId ? { ...x, content: JSON.parse(content) } : x,
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

export function UpdatesEditor({
   rowId,
   entryId,
   blocks,
   siteId,
}: {
   rowId: string;
   entryId?: string;
   blocks?: CustomElement[];
   siteId: string | undefined;
}) {
   const editor = useMemo(
      () => withLinkify(withReact(withHistory(createEditor()))),
      [],
   );
   const isMount = useIsMount();
   const fetcher = useFetcher();
   const [value, setValue] = useState("");

   const debouncedValue = useDebouncedValue(value, 500);

   useEffect(() => {
      if (!isMount) {
         fetcher.submit(
            {
               content: JSON.stringify(debouncedValue),
               intent: "updateEntry",
               rowId,
               entryId: entryId ?? "",
            },
            { method: "patch", action: `/blocks/updates` },
         );
      }
   }, [debouncedValue]);

   return (
      <Slate
         //@ts-ignore
         onChange={(e) => setValue(e)}
         editor={editor}
         initialValue={(blocks as Descendant[]) ?? initialValue()}
      >
         <Toolbar />
         <Editable
            className="outline-none"
            renderElement={EditorBlocks}
            renderLeaf={Leaf}
            onKeyDown={(e) => onKeyDown(e, editor)}
         />
      </Slate>
   );
}
