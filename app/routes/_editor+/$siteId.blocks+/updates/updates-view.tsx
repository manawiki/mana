import { useMemo } from "react";

import { useMatches } from "@remix-run/react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import type { Update } from "payload/generated-types";
import { H2Default } from "~/components/H2";
// eslint-disable-next-line import/no-cycle
import { EditorBlocks } from "~/routes/_editor+/core/components/EditorBlocks";
import { Leaf } from "~/routes/_editor+/core/components/Leaf";
import type { UpdatesElement } from "~/routes/_editor+/core/types";

type Props = {
   element: UpdatesElement;
};

const dateFormat = (dateString: string) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
   }).format(new Date(dateString));

export function BlockUpdatesView({ element }: Props) {
   //layout presume to have site data, might be brittle in the future
   //@ts-expect-error
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
}

const UpdatesEditorView = ({ content }: { content: Descendant[] }) => {
   const editor = useMemo(() => withReact(createEditor()), []);
   return (
      <Slate editor={editor} initialValue={content}>
         <Editable
            renderElement={EditorBlocks}
            renderLeaf={Leaf}
            readOnly={true}
         />
      </Slate>
   );
};
