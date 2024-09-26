import { Link } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";

export function TableOfContentsTemplate({
   sections,
}: {
   sections:
      | Collection["sections"]
      | { id: string; slug: string; name: string }[];
}) {
   return (
      <>
         {sections && sections?.length > 1 && (
            <section className="relative w-full">
               <div className="text-sm border-y tablet:border border-color-sub overflow-hidden shadow-sm shadow-1 tablet:rounded-lg bg-zinc-50 dark:bg-dark350">
                  <div className="py-3 px-2.5 font-bold text-xs flex items-center justify-between gap-2.5 border-b border-color shadow-zinc-100/70 dark:shadow-zinc-800/70 shadow-sm">
                     <div className="flex items-center gap-2.5">
                        <Icon
                           name="list"
                           size={18}
                           className="dark:text-zinc-500 text-zinc-400"
                        />
                        <span>Table of Contents</span>
                     </div>
                  </div>
                  <div className="py-3.5 space-y-2.5">
                     {sections?.map((section) => (
                        <div key={section.id}>
                           <div className="group flex items-center relative -ml-1.5 hover:underline dark:decoration-zinc-500 decoration-zinc-300">
                              <div
                                 className="size-3 border group-hover:bg-zinc-200 dark:border-zinc-600 border-zinc-300 dark:group-hover:border-zinc-500
                               bg-zinc-100 dark:bg-dark450 rounded-full dark:shadow-zinc-800 dark:group-hover:bg-dark500"
                              />
                              <div className="w-3 h-[1px] dark:bg-zinc-700 bg-zinc-200" />
                              <Link
                                 to={`#${section?.slug}`}
                                 className={clsx(
                                    section?.subSections &&
                                       section?.subSections?.length > 1
                                       ? "rounded-t-lg border-b-0"
                                       : "rounded-lg shadow-sm shadow-zinc-100 dark:shadow-zinc-800/40",
                                    "font-bold pl-2 pr-2.5 mr-3 py-1.5 flex items-center w-full gap-1.5  dark:hover:bg-dark450 border border-color-sub bg-white dark:bg-dark400  hover:bg-zinc-100 ",
                                 )}
                              >
                                 <Icon
                                    name="hash"
                                    size={12}
                                    className="dark:text-zinc-500 text-zinc-400"
                                 />
                                 <span className="pr-1">{section.name}</span>
                                 <div className="border-t border-dotted border-zinc-300/80 dark:border-zinc-600 flex-grow" />
                                 <Icon
                                    name="chevron-down"
                                    size={14}
                                    className="dark:text-zinc-500 text-zinc-400"
                                 />
                              </Link>
                           </div>
                           {section?.subSections &&
                           section?.subSections?.length > 1 ? (
                              <div
                                 className={clsx(
                                    section?.subSections &&
                                       section?.subSections?.length > 1
                                       ? "rounded-b-lg"
                                       : "rounded-lg",
                                    "border border-color-sub overflow-hidden divide-y divide-color-sub mr-3 ml-[16.5px] tablet:ml-[17px] bg-3-sub shadow-sm shadow-zinc-100 dark:shadow-zinc-800/50",
                                 )}
                              >
                                 {section.subSections?.map((subSection) => (
                                    <Link
                                       key={subSection.id}
                                       className="group flex w-full items-center justify-between relative dark:hover:bg-dark450 hover:bg-zinc-50 dark:decoration-zinc-500 decoration-zinc-300 px-2.5 py-2 text-xs font-bold"
                                       to={
                                          section.viewType == "rows"
                                             ? `#${subSection?.slug}`
                                             : `?section=${subSection?.slug}#${section?.slug}`
                                       }
                                    >
                                       <div className="flex items-center gap-2">
                                          <Icon
                                             name="corner-down-right"
                                             size={14}
                                             className="dark:text-zinc-500 text-zinc-400"
                                          />
                                          <span>{subSection.name}</span>
                                       </div>
                                       <Icon
                                          name="chevron-down"
                                          size={14}
                                          className="dark:text-zinc-500 text-zinc-400"
                                       />
                                    </Link>
                                 ))}
                              </div>
                           ) : null}
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}
      </>
   );
}
