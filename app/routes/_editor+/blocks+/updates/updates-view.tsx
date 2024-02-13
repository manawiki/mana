import { useMatches } from "@remix-run/react";
import type { Descendant } from "slate";
import type { RenderElementProps } from "slate-react";

import type { Update } from "payload/generated-types";
import { H2 } from "~/components/Headers";
import type { UpdatesElement } from "~/routes/_editor+/core/types";

// eslint-disable-next-line import/no-cycle
import { EditorView } from "../../core/components/EditorView";

export function BlockUpdatesView({
   element,
   children,
   attributes,
}: RenderElementProps & { element: UpdatesElement }) {
   //layout presume to have site data, might be brittle in the future
   //@ts-expect-error
   const updateResults = useMatches()?.[2]?.data?.updateResults as Update[];

   return (
      <section className="my-6" {...attributes}>
         {updateResults && updateResults?.length === 0 ? null : (
            <>
               <H2 text="Updates" />
               <div
                  className="divide-color-sub border-color-sub bg-3 shadow-1 divide-y 
               overflow-hidden rounded-lg border shadow-sm"
               >
                  {updateResults?.map((row) => (
                     <section
                        key={row.id}
                        className="flex  gap-2 odd:bg-zinc-50  dark:odd:bg-dark350 mobile:max-[450px]:min-h-24 items-center "
                     >
                        <time
                           suppressHydrationWarning
                           className="text-1 w-20 flex-none px-3 py-3.5 text-xs font-semibold uppercase"
                           dateTime={row?.createdAt}
                        >
                           {new Date(row?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                 month: "short",
                                 day: "numeric",
                                 timeZone: "America/Los_Angeles",
                              },
                           )}
                        </time>
                        <span className="divide-color flex-grow divide-y text-sm">
                           {row.entry?.length === 0 ? null : (
                              <>
                                 {row.entry?.map((item) => (
                                    <div key={item.id} className="py-3 pr-3">
                                       <EditorView
                                          data={item.content as Descendant[]}
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
         {children}
      </section>
   );
}
