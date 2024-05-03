import { Link } from "@remix-run/react";
import urlSlug from "url-slug";

import { Icon } from "~/components/Icon";

export function PostTableOfContents({
   data,
}: {
   data: [{ id: string; type: "h2" | "h3"; children: [{ text: string }] }];
}) {
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

   return (
      <>
         {rows && rows.length > 1 && (
            <section className="relative max-w-[728px] w-full mx-auto">
               <div className="text-sm border border-color-sub overflow-hidden shadow-sm shadow-1 rounded-lg mt-5 mb-4 bg-zinc-50 dark:bg-dark350">
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
            </section>
         )}
      </>
   );
}
