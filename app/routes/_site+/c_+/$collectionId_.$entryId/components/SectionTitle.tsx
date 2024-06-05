import { Link } from "@remix-run/react";
import clsx from "clsx";

import type { Collection } from "~/db/payload-types";

import type { Flatten } from "./Section";

export function SectionTitle({
   section,
}: {
   section: Flatten<Collection["sections"]>;
}) {
   const hasTitle = section?.showTitle && section.name;

   if (hasTitle)
      return (
         <div className="max-w-[728px] mx-auto">
            <Link to={`#${section?.slug}`}>
               <h2
                  className="border-color-sub border-zinc-200/80 relative  
                  mt-8 overflow-hidden  rounded-lg shadow-sm dark:shadow-black/20 mb-2.5 border-2
                    font-header text-xl font-bold  dark:bg-dark400"
               >
                  <div
                     className="pattern-dots absolute left-0 top-0 -z-0 h-full
                  w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                  pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
                  />
                  <div className="flex items-center gap-2">
                     <div className="relative h-full px-3.5 flex-grow py-2.5">
                        {section?.name}
                     </div>
                  </div>
               </h2>
            </Link>
         </div>
      );
}
