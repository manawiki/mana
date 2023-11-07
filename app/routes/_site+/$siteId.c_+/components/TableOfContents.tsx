import { Link } from "@remix-run/react";

import type { Collection } from "~/db/payload-types";

export function TableOfContents({
   sections,
}: {
   sections: Collection["sections"];
}) {
   return (
      <section className="relative text-sm border border-color-sub shadow-sm shadow-1 rounded-xl py-2.5 bg-2-sub">
         {sections?.map((section) => (
            <>
               <div
                  key={section.id}
                  className="py-2 group flex items-center relative -ml-1.5"
               >
                  <div
                     className="w-3 h-3 border group-hover:bg-white dark:border-zinc-600 border-zinc-300 dark:group-hover:border-zinc-500
                  bg-zinc-100 dark:bg-dark450 rounded-full dark:shadow-zinc-800 dark:group-hover:bg-dark500"
                  />
                  <div className="w-1.5 h-[1px] dark:bg-zinc-700 bg-zinc-200" />
                  <Link
                     to={`#${section?.id}`}
                     className="font-bold text-1 pl-1.5 pr-3"
                  >
                     {section.name}
                  </Link>
                  <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 flex-grow" />
               </div>
               {section.subSections && section.subSections?.length > 1 && (
                  <div className="pb-1 pl-0.5 -ml-[3px]">
                     {section.subSections?.map(
                        (subSection, index) =>
                           index != 0 && (
                              <div
                                 key={subSection.id}
                                 className="group py-1 flex items-center relative"
                              >
                                 <div
                                    className="w-[7px] h-2.5 group-hover:bg-zinc-300
                                 bg-zinc-200 dark:bg-dark450 rounded-r-full dark:group-hover:bg-dark500"
                                 />
                                 <Link
                                    to={`#${section?.id}?section=${subSection?.id}`}
                                    className="font-semibold text-xs pl-3 text-1"
                                 >
                                    {subSection.name}
                                 </Link>
                              </div>
                           ),
                     )}
                  </div>
               )}
            </>
         ))}
      </section>
   );
}
