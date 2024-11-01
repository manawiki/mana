import type { ReactNode } from "react";
import { useState } from "react";

import { Disclosure, Switch } from "@headlessui/react";
import clsx from "clsx";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Icon } from "~/components/Icon";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../core/dnd";

import type { ToggleBlockElement, CustomElement } from "../core/types";

type Props = {
   element: ToggleBlockElement;
   children: ReactNode;
   readOnly: boolean;
};

export function BlockToggleBlock({ element, children, readOnly }: Props) {
   //Otherwise render as regular a tag for external links
   const editor = useSlate();
   const [isOpen, setIsOpen] = useState(element.isOpen);

   interface Editors extends BaseEditor, ReactEditor {}

   function handleUpdateToggleIsOpen(
      event: any,
      editor: Editors,
      element: ToggleBlockElement,
   ) {
      const path = ReactEditor.findPath(editor, element);
      setIsOpen(event);
      return Transforms.setNodes<CustomElement>(
         editor,
         { isOpen: event },
         {
            at: path,
         },
      );
   }

   return (
      <Disclosure defaultOpen={isOpen}>
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
                  <>
                     <div
                        className={clsx(
                           open ? "rounded-b-none" : "mb-2.5 shadow-sm",
                           "shadow-1 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border px-2 py-3 relative",
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

                              <Switch
                                 checked={isOpen}
                                 onChange={(e) =>
                                    handleUpdateToggleIsOpen(e, editor, element)
                                 }
                                 className="dark:border-zinc-600/60 z-30 group-hover:flex bg-white dark:bg-dark450 flex-none absolute top-1 right-3 h-5 w-[36px] items-center rounded-full border"
                              >
                                 <div
                                    className={clsx(
                                       isOpen
                                          ? "translate-x-[8px] dark:bg-zinc-300 bg-zinc-400 -translate-y-[2px]"
                                          : "-translate-x-[8px] bg-zinc-300 dark:bg-zinc-500 -translate-y-[2px]",
                                       "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                                    )}
                                 />
                                 <div className="text-[7pt] -mt-1.5">
                                    Default {isOpen ? "Open" : "Closed"}
                                 </div>
                              </Switch>
                           </div>
                        </Disclosure.Button>
                        <div className="flex-grow border-0 bg-transparent text-[15px] font-bold focus:ring-0">
                           {children}
                        </div>
                     </div>
                  </>
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
