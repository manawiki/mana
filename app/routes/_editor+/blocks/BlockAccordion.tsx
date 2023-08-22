import { useState, type ReactNode } from "react";

import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import type { AccordionElement, CustomElement } from "../types";

type Props = {
   element: AccordionElement;
   children: ReactNode;
   readOnly: boolean;
};

export const BlockAccordion = ({ element, children, readOnly }: Props) => {
   //Otherwise render as regular a tag for external links
   const [labelValue, setLabelValue] = useState(element?.label ?? "");
   const editor = useSlate();

   const updateLabelValue = (event: any) => {
      const path = ReactEditor.findPath(editor, element);
      const newProperties: Partial<CustomElement> = {
         ...element,
         label: event,
      };
      setLabelValue(event);

      return Transforms.setNodes<CustomElement>(editor, newProperties, {
         at: path,
      });
   };
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
                        {element.label}
                     </div>
                     <div style={{ display: "none" }}>{children}</div>
                  </Disclosure.Button>
               ) : (
                  <div
                     className={clsx(
                        open ? "rounded-b-none" : "mb-2",
                        "bg-2 border-color shadow-1 flex w-full items-center overflow-hidden rounded-lg border px-3 py-2 shadow-sm"
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
                     <input
                        placeholder="Start typing..."
                        onChange={(event) =>
                           updateLabelValue(event.target.value)
                        }
                        value={labelValue}
                        type="text"
                        className="flex-grow border-0 bg-transparent font-bold focus:ring-0"
                     />
                  </div>
               )}
               <Disclosure.Panel
                  unmount={false}
                  className={clsx(
                     open ? "mb-3" : "",
                     "bg-2 border-color shadow-1 rounded-b-lg border border-t-0 p-3 text-sm shadow-sm"
                  )}
               >
                  {children}
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
};
