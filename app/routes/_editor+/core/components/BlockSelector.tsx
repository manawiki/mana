import { Fragment } from "react";

import { FloatingDelayGroup, offset } from "@floating-ui/react";
import { Dialog, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   CalendarClock,
   ChevronRight,
   Heading2,
   Heading3,
   ImagePlus,
   LayoutList,
   List,
   ListOrdered,
   Plus,
   Type,
} from "lucide-react";
import { nanoid } from "nanoid";
import type { Editor } from "slate";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

// import { CustomBlocksAddConfig } from "~/_custom/blocks";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import type { CustomElement } from "../types";
import { BlockType } from "../types";

type Props = {
   isEditorTrayOpen: any;
   setEditorTray: any;
   element: CustomElement;
   editor: Editor;
};

export function BlockSelector({
   isEditorTrayOpen,
   setEditorTray,
   element,
   editor,
}: Props) {
   function onInsertBelow(block: CustomElement) {
      const path = [ReactEditor.findPath(editor, element)[0] + 1];
      Transforms.insertNodes(editor, block, {
         at: path,
      });
   }

   const primary = [
      {
         label: "Text",
         icon: <Type size={18} />,
         description: "Paragraph",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.Paragraph,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Heading 2",
         icon: <Heading2 size={18} />,
         description: "Large size heading",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.H2,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Heading 3",
         icon: <Heading3 size={18} />,
         description: "Medium size heading",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.H3,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Bulleted list",
         icon: <List size={18} />,
         description: "A basic bulleted list",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.BulletedList,
               children: [
                  {
                     id: nanoid(),
                     type: BlockType.ListItem,
                     children: [{ text: "" }],
                  },
               ],
            });
         },
      },
      {
         label: "Ordered list",
         icon: <ListOrdered size={18} />,
         description: "A basic ordered list",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.NumberedList,
               children: [
                  {
                     id: nanoid(),
                     type: BlockType.ListItem,
                     children: [{ text: "" }],
                  },
               ],
            });
         },
      },
      {
         label: "Image",
         icon: <ImagePlus size={18} />,
         description: "Embed an Image",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.Image,
               refId: null,
               url: null,
               children: [{ text: "" }],
            });
         },
      },
   ];
   const groups = [
      {
         label: "Widgets",
         items: [
            {
               label: "Toggle Block",
               icon: <ChevronRight size={16} />,
               description: "Show or hide nested content",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.ToggleBlock,
                     isOpen: false,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Group",
               icon: <LayoutList size={16} />,
               description: "Embed collection data",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     viewMode: "2-col",
                     itemsViewMode: "grid",
                     type: BlockType.Group,
                     collection: "",
                     groupItems: [],
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Event Timeline",
               icon: <CalendarClock size={16} />,
               description: "Events with a start and end date",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.Events,
                     children: [
                        {
                           id: nanoid(),
                           type: BlockType.EventItem,
                           children: [{ text: "" }],
                        },
                     ],
                  });
               },
            },
         ],
      },
   ];

   //If custom site has blocks, add to select options
   // const customBlocks = CustomBlocksAddConfig(onInsertBelow);
   // if (customBlocks) {
   //    groups.push(customBlocks);
   // }

   return (
      <Float
         middleware={[
            offset({
               mainAxis: 13,
               crossAxis: -1,
            }),
         ]}
         dialog
         placement="right-start"
         portal
      >
         <Float.Reference>
            <button
               type="button"
               onClick={() => setEditorTray(true)}
               className="hover:bg-2 flex h-7 w-7 items-center justify-center focus:outline-none"
               aria-label="Insert block below"
            >
               <Plus
                  className={`${
                     isEditorTrayOpen ? "rotate-45 text-red-400" : ""
                  } transform transition duration-300 ease-in-out`}
                  size={16}
               />
            </button>
         </Float.Reference>
         <Transition appear show={isEditorTrayOpen} as={Fragment}>
            <Dialog as="div" onClose={() => setEditorTray(false)}>
               <div className="fixed inset-0">
                  <div className="flex min-h-full items-center p-4 text-center">
                     <Float.Content
                        as={Fragment}
                        transitionChild
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                     >
                        <Dialog.Panel>
                           <div
                              className="border-color-sub relative transform overflow-hidden rounded-b-2xl rounded-t-lg border
                   border-zinc-200 bg-white drop-shadow-lg  dark:bg-dark350 laptop:w-[728px] laptop:max-w-[728px]"
                           >
                              <div className="bg-2-sub relative z-10 inline-flex w-full gap-3 p-3">
                                 <FloatingDelayGroup
                                    delay={{ open: 1000, close: 200 }}
                                 >
                                    {primary?.map((row) => (
                                       <Tooltip key={row.label}>
                                          <TooltipTrigger>
                                             <button
                                                className="shadow-1 flex h-10 w-10 items-center justify-center rounded-lg border
                                                bg-zinc-50 text-center shadow-sm dark:border-dark500/50 dark:bg-dark450 dark:hover:bg-dark500"
                                                onClick={() => {
                                                   row.onSelect();
                                                   setEditorTray(false);
                                                }}
                                             >
                                                {row.icon}
                                             </button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                             {row.label}
                                          </TooltipContent>
                                       </Tooltip>
                                    ))}
                                 </FloatingDelayGroup>
                              </div>
                              {/* <div className="border-color relative h-12 border-y text-sm">
                                 <input
                                    className="bg-2 h-full w-full px-4 focus:outline-none"
                                    placeholder="Search..."
                                 />
                              </div> */}
                              <div className="border-color-sub bg-3-sub space-y-4 border-t px-3 py-4">
                                 {groups.map((group, indexGroup) => {
                                    return (
                                       <div key={indexGroup} className="">
                                          <div className="pb-2 pl-2 text-left text-xs font-bold">
                                             {group?.label}
                                          </div>
                                          <div className="grid gap-3 laptop:grid-cols-3">
                                             {groups[indexGroup]?.items?.map(
                                                (item, indexItem) => {
                                                   return (
                                                      <button
                                                         className="border-color hover:shadow-1 shadow-1 flex cursor-pointer items-center justify-start gap-2 rounded-xl border bg-zinc-50 p-3
                                                   text-left text-xs shadow-sm outline-none dark:border-zinc-600/40 dark:bg-dark350 dark:hover:bg-dark400"
                                                         key={indexItem}
                                                         onClick={() => {
                                                            item.onSelect();
                                                            setEditorTray(
                                                               false
                                                            );
                                                         }}
                                                      >
                                                         <div className="space-y-0.5">
                                                            <div className="flex items-center gap-1.5 pb-1">
                                                               {item.icon && (
                                                                  <div className="shadow-1 border-color flex h-5 w-5 items-center rounded-md border bg-white p-1 dark:border-none dark:bg-dark500">
                                                                     {item.icon}
                                                                  </div>
                                                               )}
                                                               <div className="font-bold">
                                                                  {item.label}
                                                               </div>
                                                            </div>
                                                            <div className="text-1 text-xs">
                                                               {
                                                                  item.description
                                                               }
                                                            </div>
                                                         </div>
                                                      </button>
                                                   );
                                                }
                                             )}
                                          </div>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        </Dialog.Panel>
                     </Float.Content>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </Float>
   );
}
