import { type ReactNode } from "react";

import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useSlate } from "slate-react";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../core/dnd";
import type { AccordionElement } from "../core/types";

type Props = {
   element: AccordionElement;
   children: ReactNode;
   readOnly: boolean;
};

export function BlockAccordion({ element, children, readOnly }: Props) {
   //Otherwise render as regular a tag for external links
   const editor = useSlate();

   return (
      <Disclosure>
         {({ open }) => (
            <>
               {readOnly ? (
                  <Disclosure.Button
                     className={clsx(
                        open ? "" : "mb-2",
                        "bg-2 border-color shadow-1 flex w-full items-center gap-3 rounded-lg border p-3 px-3 shadow-sm"
                     )}
                  >
                     <div
                        className={clsx(
                           open ? "rotate-90" : "",
                           "bg-3 shadow-1 border-color flex h-8 w-8 flex-none transform items-center justify-center rounded-full border pl-0.5 shadow-sm transition duration-300 ease-in-out"
                        )}
                     >
                        <ChevronRight size={18} />
                     </div>
                     <div className="flex-grow text-left font-bold">
                        {children}
                     </div>
                  </Disclosure.Button>
               ) : (
                  <div
                     className={clsx(
                        open ? "rounded-b-none" : "mb-2",
                        "bg-2 border-color shadow-1 flex w-full items-center gap-2 overflow-hidden rounded-lg border px-3 py-2 shadow-sm"
                     )}
                  >
                     <Disclosure.Button>
                        <div
                           contentEditable={false}
                           className={clsx(
                              open ? "rotate-90" : "",
                              "bg-3 shadow-1 border-color flex h-8 w-8 flex-none transform items-center justify-center rounded-full border pl-0.5 shadow-sm transition duration-300 ease-in-out"
                           )}
                        >
                           <ChevronRight size={18} />
                        </div>
                     </Disclosure.Button>
                     <div className="flex-grow border-0 bg-transparent font-bold focus:ring-0">
                        {children}
                     </div>
                  </div>
               )}
               <Disclosure.Panel
                  contentEditable={false}
                  unmount={false}
                  className={clsx(
                     open ? "mb-3" : "",
                     "bg-2 border-color shadow-1 rounded-b-lg border border-t-0 p-3 text-sm shadow-sm"
                  )}
               >
                  <NestedEditor
                     field="accordion-content"
                     element={element}
                     editor={editor}
                  />
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
}
