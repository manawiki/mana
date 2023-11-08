import { type ReactNode } from "react";

import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { useSlate } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { Icon } from "~/components/Icon";

import { NestedEditor } from "../core/dnd";
import type { ToggleBlockElement } from "../core/types";

type Props = {
   element: ToggleBlockElement;
   children: ReactNode;
   readOnly: boolean;
};

export function BlockToggleBlock({ element, children, readOnly }: Props) {
   //Otherwise render as regular a tag for external links
   const editor = useSlate();

   return (
      <Disclosure>
         {({ open }) => (
            <>
               {readOnly ? (
                  <Disclosure.Button
                     className={clsx(
                        open ? "rounded-b-none " : "mb-2.5 shadow-sm",
                        "shadow-1 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border px-2 py-3",
                     )}
                  >
                     <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border bg-white shadow-sm shadow-zinc-200  dark:border-zinc-600/30 dark:bg-dark450 dark:shadow-zinc-800">
                        <Icon
                           name="chevron-right"
                           className={clsx(
                              open ? "rotate-90" : "",
                              "transform pl-0.5 transition duration-300 ease-in-out",
                           )}
                           size={16}
                        />
                     </div>
                     <div className="flex-grow text-left text-[15px] font-bold">
                        {children}
                     </div>
                  </Disclosure.Button>
               ) : (
                  <div
                     className={clsx(
                        open ? "rounded-b-none" : "mb-2.5 shadow-sm",
                        "shadow-1 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border  px-2 py-3",
                     )}
                  >
                     <Disclosure.Button>
                        <div
                           contentEditable={false}
                           className="flex h-7 w-7 flex-none items-center justify-center rounded-full border bg-white shadow-sm shadow-zinc-200  dark:border-zinc-600/30 dark:bg-dark450 dark:shadow-zinc-800"
                        >
                           <Icon
                              name="chevron-right"
                              className={clsx(
                                 open ? "rotate-90" : "",
                                 "transform pl-0.5 transition duration-300 ease-in-out",
                              )}
                              size={16}
                           />
                        </div>
                     </Disclosure.Button>
                     <div className="flex-grow border-0 bg-transparent text-[15px] font-bold focus:ring-0">
                        {children}
                     </div>
                  </div>
               )}
               <Disclosure.Panel
                  contentEditable={false}
                  unmount={false}
                  className={clsx(
                     open ? "mb-3 border-t" : "",
                     "border-color-sub shadow-1 bg-3 rounded-b-lg border border-t-0 p-3 pb-1 text-sm shadow-sm",
                  )}
               >
                  <NestedEditor
                     field="toggleBlockContent"
                     element={element}
                     editor={editor}
                  />
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}
