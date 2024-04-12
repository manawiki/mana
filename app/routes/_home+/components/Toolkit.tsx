import { Tab } from "@headlessui/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";

import { EditorDemo } from "./EditorDemo";

export function ToolKit() {
   return (
      <div className="bg-zinc-50 dark:bg-zinc-800/20 w-full z-10 relative max-laptop:px-5 border-y border-color">
         <div className="max-w-[770px] mx-auto pt-14 pb-5 border-b border-color">
            <div className="font-header text-center text-2xl pb-1.5">
               Building blocks for your wiki
            </div>
            <div className="text-1 text-center">
               The tools you need to build a collaborative wiki for your
               community
            </div>
         </div>
         <div className="max-w-[770px] mx-auto gap-4 w-full pt-6 pb-20">
            <Tab.Group>
               <Tab.List className="grid max-laptop:grid-cols-2 gap-3 grid-cols-4 pb-4">
                  <Tab
                     className={({ selected }) =>
                        clsx(
                           selected
                              ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                              : "dark:bg-dark400 bg-zinc-100",
                           "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                        )
                     }
                  >
                     <div className="size-3.5 bg-blue-500 rounded-full" />
                     <span>Editor</span>
                  </Tab>
                  <Tab
                     className={({ selected }) =>
                        clsx(
                           selected
                              ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                              : "dark:bg-dark400 bg-zinc-100",
                           "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                        )
                     }
                  >
                     <Icon
                        name="pen-square"
                        className="text-emerald-500"
                        size={16}
                     />
                     Posts
                  </Tab>
                  <Tab
                     className={({ selected }) =>
                        clsx(
                           selected
                              ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                              : "dark:bg-dark400 bg-zinc-100",
                           "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                        )
                     }
                  >
                     <Icon
                        name="database"
                        className="text-amber-500"
                        size={16}
                     />
                     Collections
                  </Tab>
                  <Tab
                     className={({ selected }) =>
                        clsx(
                           selected
                              ? "bg-white dark:bg-dark450 border-zinc-200 dark:border-zinc-600"
                              : "dark:bg-dark400 bg-zinc-100",
                           "focus-visible:outline-none shadow-sm shadow-zinc-200 dark:shadow-zinc-800 w-full pl-4 pr-6 py-2.5 font-bold text-left flex items-center gap-2 text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                        )
                     }
                  >
                     <Icon
                        name="message-circle"
                        className="text-purple-500"
                        size={16}
                     />
                     Community
                  </Tab>
               </Tab.List>
               <Tab.Panels className="flex-grow">
                  <Tab.Panel>
                     <EditorDemo />
                  </Tab.Panel>
                  <Tab.Panel></Tab.Panel>
                  <Tab.Panel></Tab.Panel>
                  <Tab.Panel></Tab.Panel>
               </Tab.Panels>
            </Tab.Group>
         </div>
      </div>
   );
}
