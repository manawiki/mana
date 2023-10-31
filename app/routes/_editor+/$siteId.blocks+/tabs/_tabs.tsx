import { Fragment, useState, type ReactNode } from "react";

import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Icon } from "~/components/Icon";

// eslint-disable-next-line import/no-cycle
import { NestedEditor } from "../../core/dnd";
import {
   BlockType,
   type CustomElement,
   type TabsElement,
   type TabsItemElement,
} from "../../core/types";

export function BlockTabs({
   element,
   children,
}: {
   element: TabsElement;
   children: ReactNode;
}) {
   const editor = useSlate();
   const numberOfTabs = element.tabs.length;

   const showDelete = numberOfTabs > 2;
   const showAdd = numberOfTabs < 4;

   function addTab() {
      if (showAdd) {
         const path = ReactEditor.findPath(editor, element);
         const pathNested = path[0] ?? 0;
         Transforms.setNodes<CustomElement>(
            editor,
            {
               tabs: [...element.tabs, "New Tab"],
            },
            {
               at: path,
            },
         );
         return Transforms.insertNodes(
            editor,
            {
               id: nanoid(),
               type: BlockType.TabsItem,
               children: [{ text: "" }],
            },
            {
               at: [pathNested, element.children.length],
            },
         );
      }
   }

   function deleteTab(index: number) {
      const path = ReactEditor.findPath(editor, element);
      const pathNested = path[0] ?? 0;

      let updateTabs = [...element.tabs];

      //Must always show at least two tabs
      if (updateTabs.length > 2) {
         updateTabs.splice(index, index !== -1 ? 1 : 0);

         Transforms.setNodes<CustomElement>(
            editor,
            {
               tabs: updateTabs,
            },
            {
               at: path,
            },
         );

         return Transforms.delete(editor, {
            at: [pathNested, index],
         });
      }
   }

   return (
      <>
         <Tab.Group
            contentEditable={false}
            as="div"
            className="border border-color-sub rounded-lg shadow-sm shadow-1 mb-3"
         >
            <div className="relative group">
               <Tab.List
                  className={clsx(
                     numberOfTabs == 2 ? "grid-cols-2" : "",
                     numberOfTabs == 3 ? "grid-cols-3" : "",
                     numberOfTabs >= 4 ? "grid-cols-2 laptop:grid-cols-4" : "",
                     "grid bg-2-sub justify-between border-b border-color-sub p-3 rounded-t-md gap-3",
                  )}
               >
                  {element.tabs.map((tab, index) => (
                     <div className="w-full relative group/tab" key={index}>
                        <Tab as={Fragment}>
                           {({ selected }) => (
                              <button
                                 className={clsx(
                                    selected
                                       ? "bg-3-sub shadow-sm shadow-1  focus-visible:outline-none border-zinc-200 dark:border-zinc-600/70"
                                       : "dark:bg-dark400 bg-zinc-100 hover:shadow-sm shadow-1",
                                    "w-full p-2 font-bold block text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                                 )}
                              >
                                 {tab}
                              </button>
                           )}
                        </Tab>
                        {showDelete && (
                           <button
                              className=" h-4 w-4 rounded-full  items-center justify-center hidden dark:bg-zinc-600 absolute 
                                   -top-1 -right-1 group-hover/tab:flex dark:text-red-200 bg-red-50 text-red-500"
                              onClick={() => deleteTab(index)}
                           >
                              <Icon name="trash" size={8} />
                           </button>
                        )}
                        {/* <TabLabel
                           element={element}
                           editor={editor}
                           fieldIndex={index}
                        /> */}
                     </div>
                  ))}
               </Tab.List>
               {showAdd && (
                  <div className="absolute top-4 -right-5">
                     <button
                        className="group-hover:flex hidden items-center justify-center bg-3-sub shadow-sm shadow-1 
                     border dark:border-zinc-600/70 dark:hover:border-zinc-500/70 w-7 h-7 rounded-full text-xs font-bold"
                        onClick={() => addTab()}
                     >
                        <Icon name="plus" size={14} />
                     </button>
                  </div>
               )}
            </div>
            <Tab.Panels className="p-3 pb-0">{children}</Tab.Panels>
         </Tab.Group>
      </>
   );
}
export function BlockTabsItem({ element }: { element: TabsItemElement }) {
   const editor = useSlate();

   return (
      <Tab.Panel>
         <NestedEditor field="tabContent" element={element} editor={editor} />
      </Tab.Panel>
   );
}

function TabLabel({
   element,
   editor,
   fieldIndex,
}: {
   element: TabsElement;
   editor: BaseEditor & ReactEditor;
   fieldIndex: number;
}) {
   const [labelValue, setLabelValue] = useState(
      element?.tabs[fieldIndex] ?? "",
   );

   function updateLabel(event: string) {
      const currentTabs = element.tabs;
      const path = ReactEditor.findPath(editor, element);
      const newTabs = currentTabs.map((tab: string, _tabIndex: number) =>
         _tabIndex == fieldIndex ? event : tab,
      );
      setLabelValue(event);

      Transforms.setNodes<CustomElement>(
         editor,
         {
            tabs: newTabs,
         },
         {
            at: path,
         },
      );
   }

   return (
      <input
         placeholder="Start typing..."
         onChange={(event) => {
            updateLabel(event.target.value);
         }}
         value={labelValue}
         type="text"
         className="border-0 text-center bg-transparent w-full p-0 text-sm font-bold focus:ring-0"
      />
   );
}
