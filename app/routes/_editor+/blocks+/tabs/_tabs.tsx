import { Fragment, useState } from "react";

import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { nanoid } from "nanoid";
import type { BaseEditor } from "slate";
import { Transforms } from "slate";
import { ReactEditor, type RenderElementProps, useSlate } from "slate-react";

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
   attributes,
   readOnly,
}: RenderElementProps & {
   element: TabsElement;
   readOnly: boolean;
}) {
   const editor = useSlate();
   const numberOfTabs = element.tabs.length;

   const showAdd = numberOfTabs < 4;

   function addTab() {
      if (showAdd) {
         const path = ReactEditor.findPath(editor, element);
         const pathNested = path[0] ?? 0;
         Transforms.setNodes<CustomElement>(
            editor,
            {
               tabs: [...element.tabs, `Tab ${numberOfTabs + 1}`],
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

   return (
      <>
         <Tab.Group
            contentEditable={false}
            as="div"
            className="border border-color-sub rounded-t-lg rounded-b-xl shadow-sm shadow-1 mb-3"
            {...attributes}
         >
            <div className="relative group">
               <Tab.List
                  className={clsx(
                     numberOfTabs == 2 ? "grid-cols-2" : "",
                     numberOfTabs == 3 ? "grid-cols-3" : "",
                     numberOfTabs >= 4 ? "grid-cols-2 laptop:grid-cols-4" : "",
                     "grid bg-2-sub justify-between border-b border-color-sub p-3 rounded-t-lg gap-3",
                  )}
               >
                  {element.tabs.map((tab, index) => (
                     <TabItem
                        key={index}
                        tab={tab}
                        element={element}
                        editor={editor}
                        fieldIndex={index}
                        readOnly={readOnly}
                     />
                  ))}
               </Tab.List>
               {showAdd && !readOnly && (
                  <div className="absolute -top-3 -right-3.5">
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
export function BlockTabsItem({
   element,
   children,
   attributes,
}: RenderElementProps & { element: TabsItemElement }) {
   const editor = useSlate();

   return (
      <Tab.Panel {...attributes}>
         <NestedEditor field="tabContent" element={element} editor={editor} />
         {children}
      </Tab.Panel>
   );
}

function TabItem({
   element,
   editor,
   fieldIndex,
   tab,
   readOnly,
}: {
   element: TabsElement;
   editor: BaseEditor & ReactEditor;
   fieldIndex: number;
   tab: string;
   readOnly: boolean;
}) {
   const [labelValue, setLabelValue] = useState(
      element?.tabs[fieldIndex] ?? "",
   );

   const numberOfTabs = element.tabs.length;

   const showDelete = numberOfTabs > 2;
   const [isEditMode, setEditMode] = useState(false);

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
      <div className="w-full relative group/tab">
         {!isEditMode && (
            <>
               <Tab as={Fragment}>
                  {({ selected }) => (
                     <button
                        className={clsx(
                           selected
                              ? "bg-white dark:bg-dark450 shadow-sm shadow-1 focus-visible:outline-none border-zinc-200 dark:border-zinc-600"
                              : "dark:bg-dark400 bg-zinc-100 hover:shadow-sm shadow-1",
                           "w-full h-10 px-2 font-bold block text-xs laptop:text-sm rounded-lg truncate border border-transparent",
                        )}
                     >
                        {tab}
                     </button>
                  )}
               </Tab>
               {!readOnly && (
                  <button
                     className="h-9 w-9 rounded-full z-10 items-center justify-center hidden absolute 
                  top-0.5 right-0 group-hover/tab:flex dark:text-zinc-500 text-zinc-400 hover:text-zinc-500 hover:dark:text-zinc-400"
                     onClick={() => setEditMode(!isEditMode)}
                  >
                     <Icon name="pencil" size={14} />
                  </button>
               )}
            </>
         )}
         {isEditMode && (
            <div className="border border-dashed h-10 rounded-lg border-zinc-300 dark:border-zinc-600 shadow-sm shadow-1">
               <input
                  placeholder="Start typing..."
                  onChange={(event) => {
                     updateLabel(event.target.value);
                  }}
                  autoFocus
                  value={labelValue}
                  type="text"
                  className="border-0  text-xs laptop:text-sm text-center h-full bg-transparent w-full p-0 font-bold focus:ring-0"
               />
               {showDelete && (
                  <button
                     className="h-9 w-9 rounded-full dark:text-zinc-500 text-zinc-400 hover:text-zinc-500 hover:dark:text-zinc-400  
                     items-center justify-center hidden absolute top-0.5 left-0 group-hover/tab:flex"
                     onClick={() => deleteTab(fieldIndex)}
                  >
                     <Icon name="trash" size={14} />
                  </button>
               )}
               <button
                  className="h-9 w-9 rounded-full items-center justify-center hidden absolute 
               top-0.5 right-0 group-hover/tab:flex"
                  onClick={() => setEditMode(!isEditMode)}
               >
                  <Icon name="chevron-right" className="text-1" size={20} />
               </button>
            </div>
         )}
      </div>
   );
}
