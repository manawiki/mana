import { useState } from "react";

import { Link } from "@remix-run/react";
import clsx from "clsx";
import urlSlug from "url-slug";

import { Icon } from "~/components/Icon";

export function PostTableOfContents({
   data,
}: {
   data: [{ id: string; type: "h2" | "h3"; children: [{ text: string }] }];
}) {
   const [seeAllOpen, setSeeAllOpen] = useState<boolean>(false);

   const rows = data
      ?.filter((x) => x.type == "h2" || x.type == "h3")
      .map((row) => {
         return {
            id: row.id,
            type: row.type,
            name: row.children[0].text,
            slug: urlSlug(row.children[0].text),
         };
      });

   const totalTOCItem = rows && rows.length;

   const showAll = !seeAllOpen && totalTOCItem && totalTOCItem > 5;

   const showText = showAll && rows?.length > 5 && rows?.length - 5;

   return (
      <>
         {rows && rows.length > 1 && (
            <section className="relative max-w-[728px] w-full mx-auto">
               <div
                  className={clsx(
                     seeAllOpen ? "" : "max-h-[244px]",
                     "text-sm border border-color-sub overflow-hidden shadow-sm shadow-1 rounded-lg mt-5 mb-4 bg-zinc-50 dark:bg-dark350",
                  )}
               >
                  <div className="py-3 px-2.5 font-bold text-xs flex items-center justify-between gap-2.5 border-b border-color shadow-zinc-100/70 dark:shadow-zinc-800/70 shadow-sm">
                     <div className="flex items-center gap-2.5">
                        <Icon
                           name="list"
                           size={18}
                           className="dark:text-zinc-500 text-zinc-400"
                        />
                        <span>Table of Contents</span>
                     </div>
                     {!showAll && rows.length > 5 && (
                        <button
                           onClick={() => setSeeAllOpen(!seeAllOpen)}
                           className="w-6 h-6 bg-white dark:bg-dark450 z-10 shadow-sm shadow-1 hover:border-zinc-300
                           rounded-full flex items-center justify-center border dark:hover:border-zinc-500
                           dark:border-zinc-600"
                        >
                           <Icon
                              name="chevron-up"
                              title="Hide Table of Contents"
                              size={14}
                              className="dark:text-zinc-400 text-zinc-400"
                           />
                        </button>
                     )}
                  </div>
                  <div className="py-1.5">
                     {rows?.map((row) => (
                        <div key={row.id}>
                           {row.type == "h2" && (
                              <div className="py-2 group flex items-center relative -ml-1.5 hover:underline dark:decoration-zinc-500 decoration-zinc-300">
                                 <div
                                    className="w-3 h-3 border group-hover:bg-zinc-200 dark:border-zinc-600 border-zinc-300 dark:group-hover:border-zinc-500
                      bg-zinc-100 dark:bg-dark500 rounded-full dark:shadow-zinc-800 dark:group-hover:bg-dark500"
                                 />
                                 <div className="w-2.5 h-[1px] dark:bg-zinc-700 bg-zinc-200" />
                                 <Link
                                    to={`#${row.slug}`}
                                    className="font-bold pl-1.5 pr-3"
                                 >
                                    {row.name}
                                 </Link>
                                 <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 flex-grow" />
                              </div>
                           )}
                           {row.type == "h3" && (
                              <div className="pb-1 pl-0.5 -ml-[3px]">
                                 <div className="group flex w-full items-center relative hover:underline dark:decoration-zinc-500 decoration-zinc-300">
                                    <div
                                       className="w-[4px] h-4 group-hover:bg-zinc-300 -ml-[1px]
                                            bg-zinc-200 dark:bg-dark450 rounded-r-sm dark:group-hover:bg-dark500"
                                    />
                                    <Link
                                       to={`#${row.slug}`}
                                       className="font-semibold text-sm rounded-lg pl-2.5 mx-3 dark:hover:bg-dark400 hover:bg-zinc-100 text-1 w-full py-1 block"
                                    >
                                       {row.name}
                                    </Link>
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
               {showAll && (
                  <div
                     className="bg-gradient-to-b absolute bottom-0 border border-color-sub border-t-0 w-full group p-3
                  from-transparent to-zinc-50 dark:to-dark400 dark:from-transparent rounded-b-lg"
                  >
                     <button
                        onClick={() => setSeeAllOpen(!seeAllOpen)}
                        className="w-full flex justify-end items-center gap-3"
                     >
                        <div className="text-[11px] group-hover:underline underline-offset-2 font-semibold text-right">
                           Show {showText} more items...
                        </div>
                        <div
                           className="w-6 h-6 bg-white dark:bg-dark450 z-10 shadow-sm shadow-1 group-hover:border-zinc-300
                           rounded-full flex items-center justify-center border dark:group-hover:border-zinc-500
                           dark:border-zinc-600"
                        >
                           <Icon
                              name="chevron-down"
                              size={16}
                              className="dark:text-zinc-400 text-zinc-400 pt-0.5"
                           />
                        </div>
                     </button>
                  </div>
               )}
            </section>
         )}
      </>
   );
}
