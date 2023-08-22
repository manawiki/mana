import { useMemo } from "react";

import { useMatches } from "@remix-run/react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import type { Update } from "payload/generated-types";
import { H2Default } from "~/components/H2";
// eslint-disable-next-line import/no-cycle
import { Block } from "~/routes/_editor+/blocks/Block";
import { Leaf } from "~/routes/_editor+/blocks/Leaf";
import type { UpdatesElement } from "~/routes/_editor+/types";

type Props = {
   element: UpdatesElement;
};

const dateFormat = (dateString: string) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
   }).format(new Date(dateString));

export const BlockUpdatesView = ({ element }: Props) => {
   //layout presume to have site data, might be brittle in the future
   const updateResults = useMatches()?.[2]?.data?.updateResults as Update[];

   return (
      <section className="my-6">
         {updateResults && updateResults?.length === 0 ? null : (
            <>
               <H2Default text="Updates" />
               <div
                  className="divide-color border-color bg-2 shadow-1 divide-y 
               overflow-hidden rounded-lg border shadow-sm"
               >
                  {/* <div className="relative px-3 py-2.5">
                  <div className="relative z-10 font-header text-lg font-bold">
                     Updates
                  </div>
                  <div
                     className="pattern-dots absolute left-0 top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
                  ></div>
                  <div
                     className="absolute left-0 top-0 h-full w-full 
               bg-gradient-to-r from-zinc-50/20 to-white/50 dark:from-zinc-800/30"
                  ></div>
               </div> */}
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
                           {row.entry?.length === 0 ? null : (
                              <>
                                 {row.entry?.map((item) => (
                                    <div key={item.id} className="py-3 pr-3">
                                       <UpdatesEditorView
                                          content={item.content as Descendant[]}
                                       />
                                    </div>
                                 ))}
                              </>
                           )}
                        </span>
                     </section>
                  ))}
               </div>
            </>
         )}
      </section>
   );
};

const useEditor = () => useMemo(() => withReact(createEditor()), []);

const UpdatesEditorView = ({ content }: { content: Descendant[] }) => {
   const editor = useEditor();
   return (
      <Slate editor={editor} initialValue={content}>
         <Editable renderElement={Block} renderLeaf={Leaf} readOnly={true} />
      </Slate>
   );
};
