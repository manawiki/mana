import { Fragment, type ReactNode } from "react";

import { offset, FloatingDelayGroup } from "@floating-ui/react";
import { Menu } from "@headlessui/react";
// import { Float } from "@headlessui-float/react";
import { nanoid } from "nanoid";
import { Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

// eslint-disable-next-line import/no-cycle
import { InlineEditor } from "../core/components/InlineEditor";
import {
   type InfoBoxElement,
   type InfoBoxItemElement,
   BlockType,
} from "../core/types";

export function BlockInfoBox({
   children,
   element,
   readOnly,
}: {
   element: InfoBoxElement;
   children: ReactNode;
   readOnly: boolean;
}) {
   const editor = useSlate();

   if (readOnly) {
      return (
         <div className="shadow-1 bg-2-sub divide-color-sub border-color-sub relative z-10 divide-y rounded-lg border shadow-sm mb-3">
            {children}
         </div>
      );
   }

   function handleAddInfoBoxRow() {
      const path = [
         ReactEditor.findPath(editor, element)[0],
         element.children[0].id ? element.children.length : 0,
      ];
      Transforms.insertNodes(
         editor,
         {
            id: nanoid(),
            type: BlockType.InfoBoxItem,
            children: [{ text: "-" }],
            infoBoxLeftContent: [
               {
                  id: nanoid(),
                  type: BlockType.Paragraph,
                  children: [
                     {
                        text: "--",
                     },
                  ],
               },
            ],
            infoBoxRightContent: [
               {
                  id: nanoid(),
                  type: BlockType.Paragraph,
                  children: [
                     {
                        text: "-",
                     },
                  ],
               },
            ],
         },
         //@ts-ignore
         { at: path },
      );
   }

   return (
      <section className="group/infobox pb-3 relative">
         <div className="shadow-1 bg-2-sub divide-color-sub border-color-sub relative z-10 divide-y rounded-lg border shadow-sm">
            {children}
         </div>
         <Tooltip placement="bottom" setDelay={800}>
            <TooltipTrigger
               title="Add Button"
               contentEditable={false}
               onClick={handleAddInfoBoxRow}
               className="transition group-hover/infobox:opacity-100 opacity-0 z-10
               shadow-1 flex h-8 items-center justify-center gap-2 rounded-b-full border-color-sub border bg-white
               p-3 text-xs font-bold shadow-sm dark:bg-dark400 dark:hover:bg-dark450
               absolute -bottom-5 right-12 select-none duration-100 ease-in laptop:translate-x-full laptop:translate-y-0"
            >
               <Icon name="plus" className="text-1" size={14} />
            </TooltipTrigger>
            <TooltipContent>Add row</TooltipContent>
         </Tooltip>
      </section>
   );
}

export function BlockInfoBoxItem({
   element,
   readOnly,
}: {
   element: InfoBoxItemElement;
   readOnly: boolean;
}) {
   const editor = useSlate();
   const path = ReactEditor.findPath(editor, element);

   return (
      <div className="relative group">
         <div
            className="flex items-center justify-between gap-4 p-3 pb-0"
            contentEditable={false}
         >
            <div className="flex-grow">
               <InlineEditor
                  editor={editor}
                  element={element}
                  readOnly={readOnly}
                  field="infoBoxLeftContent"
               />
            </div>
            <div className="flex-none min-h-[12px] min-w-[18px]">
               <InlineEditor
                  editor={editor}
                  element={element}
                  readOnly={readOnly}
                  field="infoBoxRightContent"
               />
            </div>
         </div>
         {!readOnly && (
            <Menu
               as="div"
               className="absolute group-hover:opacity-100 opacity-0 top-2 -right-2.5"
            >
               {({ open }) => (
                  // <Float
                  //    as={Fragment}
                  //    enter="transition ease-out duration-100"
                  //    enterFrom="transform opacity-0 scale-95"
                  //    enterTo="transform opacity-100 scale-100"
                  //    leave="transition ease-in duration-75"
                  //    leaveFrom="transform opacity-100 scale-100"
                  //    leaveTo="transform opacity-0 scale-95"
                  //    placement="bottom-end"
                  //    middleware={[
                  //       offset({
                  //          mainAxis: 4,
                  //          crossAxis: -6,
                  //       }),
                  //    ]}
                  //    portal
                  // >
                  <>
                     <Menu.Button
                        className="border-color-sub bg-2-sub group/menu -mr-1.5 flex h-8 w-4 items-center 
                 justify-center rounded-lg rounded-l-none border border-l-0 transition duration-300"
                     >
                        {open ? (
                           <Icon
                              name="x"
                              size={12}
                              className="pr-0.5 transition duration-150 ease-in-out"
                           />
                        ) : (
                           <>
                              <Icon
                                 name="more-vertical"
                                 size={16}
                                 className="pr-0.5 transition duration-150 ease-in-out group-active/menu:translate-y-0.5"
                              />
                           </>
                        )}
                     </Menu.Button>
                     <Menu.Items className="border-color-sub bg-3-sub shadow-1 flex flex-col items-center justify-center rounded-lg border shadow">
                        <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
                           <Menu.Item>
                              <Tooltip placement="left">
                                 <TooltipTrigger title="Delete Button">
                                    <button
                                       className="m-1 flex h-8 w-8 items-center justify-center gap-2 rounded-md text-sm font-bold hover:bg-zinc-100 dark:hover:bg-dark450"
                                       onClick={() => {
                                          Transforms.delete(editor, {
                                             at: path,
                                          });
                                       }}
                                    >
                                       <Icon
                                          name="trash"
                                          size={14}
                                          className="text-red-400"
                                       />
                                    </button>
                                 </TooltipTrigger>
                                 <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                           </Menu.Item>
                           <Menu.Item>
                              <Tooltip placement="left">
                                 <TooltipTrigger title="Copy Button">
                                    <button className="m-1 flex h-8 w-8 items-center justify-center gap-2 rounded-md text-sm font-bold hover:bg-zinc-100 dark:hover:bg-dark450">
                                       <Icon name="copy" size={14} />
                                    </button>
                                 </TooltipTrigger>
                                 <TooltipContent>Copy</TooltipContent>
                              </Tooltip>
                           </Menu.Item>
                        </FloatingDelayGroup>
                     </Menu.Items>
                  </>
                  // </Float>
               )}
            </Menu>
         )}
      </div>
   );
}
