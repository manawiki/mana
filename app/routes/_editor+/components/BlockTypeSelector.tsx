import { Fragment, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   CalendarClock,
   CheckSquare,
   Codesandbox,
   Heading2,
   Heading3,
   ImagePlus,
   LayoutList,
   List,
   ListOrdered,
   Plus,
   Type,
   UnfoldVertical,
   X,
   Youtube,
} from "lucide-react";
import { nanoid } from "nanoid";

import { CustomBlocksAddConfig } from "~/_custom/blocks";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";

import type { CustomElement } from "../core/types";
import { BlockType } from "../core/types";

type Props = {
   onSelect: (block: CustomElement) => void;
};

export function BlockTypeSelector({ onSelect }: Props) {
   const primary = [
      {
         label: "Text",
         icon: <Type size={16} />,
         description: "Plain text",
         onSelect: () => {
            onSelect({
               id: nanoid(),
               type: BlockType.Paragraph,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Heading 2",
         icon: <Heading2 size={16} />,
         description: "Large size heading",
         onSelect: () => {
            onSelect({
               id: nanoid(),
               type: BlockType.H2,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Heading 3",
         icon: <Heading3 size={16} />,
         description: "Medium size heading",
         onSelect: () => {
            onSelect({
               id: nanoid(),
               type: BlockType.H3,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Bulleted list",
         icon: <List size={16} />,
         description: "A basic bulleted list",
         onSelect: () => {
            onSelect({
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
         icon: <ListOrdered size={16} />,
         description: "A basic ordered list",
         onSelect: () => {
            onSelect({
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
         label: "To do list",
         icon: <CheckSquare size={16} />,
         description: "A basic to do list",
         onSelect: () => {
            onSelect({
               id: nanoid(),
               type: BlockType.ToDo,
               checked: false,
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
               label: "Group",
               icon: <LayoutList size={20} />,
               description: "Create a group of collections",
               onSelect: () => {
                  onSelect({
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
               icon: <CalendarClock size={20} />,
               description: "Create events with a start and end date",
               onSelect: () => {
                  onSelect({
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
            {
               label: "Accordion",
               icon: <UnfoldVertical size={20} />,
               description: "Add an accordion",
               onSelect: () => {
                  onSelect({
                     id: nanoid(),
                     type: BlockType.Accordion,
                     label: "",
                     isOpen: true,
                     children: [{ text: "" }],
                  });
               },
            },
            // {
            //    label: "Updates",
            //    icon: <LayoutList size={20} />,
            //    description: "Create a list of Updates",
            //    onSelect: () => {
            //       onSelect({
            //          id: nanoid(),
            //          type: BlockType.Updates,
            //          children: [{ text: "" }],
            //       });
            //    },
            // },
         ],
      },
      {
         label: "Media",
         items: [
            {
               label: "Image",
               icon: <ImagePlus size={20} />,
               description: "Embed an Image",
               onSelect: () => {
                  onSelect({
                     id: nanoid(),
                     type: BlockType.Image,
                     refId: null,
                     url: null,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Youtube Video",
               icon: <Youtube size={20} />,
               description: "Embed YouTube video",
               onSelect: () => {
                  onSelect({
                     id: nanoid(),
                     type: BlockType.Video,
                     url: null,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
      {
         label: "Embeds",
         items: [
            {
               label: "CodeSandbox",
               icon: <Codesandbox size={20} />,
               description: "Embed CodeSandbox project",
               onSelect: () => {
                  onSelect({
                     id: nanoid(),
                     type: BlockType.CodeSandbox,
                     url: null,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
   ];

   // const path = [
   //    ReactEditor.findPath(editor, props.element)[0] + 1,
   // ];

   // Transforms.insertNodes(editor, block, {
   //    at: path,
   // });

   // Transforms.wrapNodes(editor, list, {
   //    match: (n) => n.type === BlockType.ListItem,
   // });
   // {
   //    id: nanoid(),
   //    type: BlockType.Events,
   //    children: [
   //       {
   //          id: nanoid(),
   //          label: "Hello",
   //          type: BlockType.EventItem,
   //          children: [{ text: "asd 123" }],
   //       },
   //    ],
   // }

   //If custom site has blocks, add to select options
   const customBlocks = CustomBlocksAddConfig(onSelect);
   if (customBlocks) {
      groups.push(customBlocks);
   }
   const [isOpen, setIsOpen] = useState(false);

   function closeModal() {
      setIsOpen(false);
   }

   function openModal() {
      setIsOpen(true);
   }
   return (
      <Float dialog placement="bottom-start" offset={6}>
         <Float.Reference>
            <button
               type="button"
               onClick={openModal}
               className="hover:bg-2 flex h-7 w-7 items-center justify-center focus:outline-none"
               aria-label="Insert block below"
            >
               <Plus size={16} />
            </button>
         </Float.Reference>

         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative" onClose={closeModal}>
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
                           <button
                              type="button"
                              className="bg-2 absolute -top-[35px] left-3 flex h-9 w-10 items-center justify-center rounded-t-lg
                              border border-zinc-200 text-xs font-bold drop-shadow-xl hover:bg-white dark:border-zinc-700 dark:shadow-zinc-800 dark:hover:bg-zinc-800"
                              onClick={closeModal}
                           >
                              <X size={16} className="text-red-400" />
                           </button>
                           <div
                              className="transform overflow-hidden rounded-b-xl rounded-t-lg border border-zinc-200
                   bg-white drop-shadow-lg dark:border-zinc-700 dark:bg-neutral-800 laptop:w-screen laptop:max-w-[800px]"
                           >
                              <div className="dark:bg2Dark roudned-t-lg relative z-10 inline-flex w-full gap-3 bg-white p-3 dark:bg-neutral-800">
                                 {primary?.map((row) => (
                                    <Tooltip key={row.label}>
                                       <TooltipTrigger>
                                          <button
                                             className="bg-2 shadow-1 border-color flex h-10 w-10 items-center justify-center rounded-lg border text-center shadow-sm"
                                             onClick={() => {
                                                row.onSelect();
                                                closeModal();
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
                              </div>
                              <div className="border-color relative h-12 border-y text-sm">
                                 <input
                                    className="bg-2 h-full w-full px-4 focus:outline-none"
                                    placeholder="Search..."
                                 />
                              </div>
                              <div className="space-y-4 px-3 py-4">
                                 {groups.map((group, indexGroup) => {
                                    return (
                                       <div key={indexGroup} className="">
                                          <div className="text-1 pb-2 pl-2 text-left text-xs font-bold">
                                             {group?.label}
                                          </div>
                                          <div className="grid gap-3 laptop:grid-cols-3">
                                             {groups[indexGroup]?.items?.map(
                                                (item, indexItem) => {
                                                   return (
                                                      <button
                                                         className="border-color hover:shadow-1 flex cursor-pointer items-center gap-2 rounded-xl border bg-zinc-50 p-2
                                                   text-left text-xs outline-none hover:shadow-sm dark:border-zinc-700/40 dark:bg-bg2Dark dark:hover:bg-bg3Dark"
                                                         key={indexItem}
                                                         onClick={() => {
                                                            item.onSelect();
                                                            closeModal();
                                                         }}
                                                      >
                                                         {item.icon && (
                                                            <div
                                                               className="shadow-1 flex h-8 w-8 items-center
                                                         justify-center rounded-lg bg-white shadow-sm dark:bg-bg3Dark"
                                                            >
                                                               {item.icon}
                                                            </div>
                                                         )}
                                                         <div className="space-y-0.5 truncate">
                                                            <div className="font-bold text-zinc-500 dark:text-zinc-300">
                                                               {item.label}
                                                            </div>
                                                            <div className="text-1 truncate text-xs">
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

// Alternative version
// <Popover>
//    {({ open }) => (
//       <>
//          <Float
//             as={Fragment}
//             enter="transition ease-out duration-200"
//             enterFrom="opacity-0 translate-y-1"
//             enterTo="opacity-100 translate-y-0"
//             leave="transition ease-in duration-150"
//             leaveFrom="opacity-100 translate-y-0"
//             leaveTo="opacity-0 translate-y-1"
//             placement="right-start"
//             offset={8}
//             portal
//          >
//             <Popover.Button
//                className="hover:bg-2 flex h-7 w-7 items-center justify-center focus:outline-none"
//                aria-label="Insert block below"
//             >
//                <Plus
//                   className={`${
//                      open ? "rotate-45 text-red-400" : ""
//                   } transform transition duration-300 ease-in-out`}
//                   size={16}
//                />
//             </Popover.Button>
//             <Popover.Panel
//                className="border-color transform overflow-hidden rounded-lg border
//             bg-zinc-50 shadow dark:bg-neutral-800 dark:shadow-zinc-900 laptop:w-screen laptop:max-w-[736px]"
//             >
//                <>
//                   <div className="dark:bg2Dark relative z-10 inline-flex w-full gap-3 bg-white p-3 dark:bg-neutral-800">
//                      {primary?.map((row) => (
//                         <Tooltip
//                            key={row.label}
//                            id="primary"
//                            side="bottom"
//                            content={row.label}
//                         >
//                            <button
//                               className="bg-2 shadow-1 border-color flex h-10 w-10 items-center justify-center rounded-lg border text-center shadow-sm"
//                               onClick={row.onSelect}
//                            >
//                               {row.icon}
//                            </button>
//                         </Tooltip>
//                      ))}
//                   </div>
//                   <div className="border-color relative h-12 border-y text-sm">
//                      <input
//                         className="bg-2 h-full w-full px-4 focus:outline-none"
//                         placeholder="Search..."
//                      />
//                   </div>
//                   <div className="space-y-4 p-3">
//                      {groups.map((group, indexGroup) => {
//                         return (
//                            <div key={indexGroup} className="">
//                               <div className="text-1 pb-2 pl-2 text-xs font-bold">
//                                  {group?.label}
//                               </div>
//                               <div className="grid gap-3 laptop:grid-cols-3">
//                                  {groups[indexGroup]?.items?.map(
//                                     (item, indexItem) => {
//                                        return (
//                                           <button
//                                              className="bg-3 shadow-1 flex cursor-pointer items-center gap-2 rounded-lg p-2 text-left
//                                              text-xs shadow-sm outline-none hover:bg-zinc-50 dark:hover:bg-bg3Dark"
//                                              key={indexItem}
//                                              onClick={item.onSelect}
//                                           >
//                                              {item.icon && (
//                                                 <div
//                                                    className="flex h-8 w-8 items-center justify-center
//                                                    rounded-lg bg-zinc-100 dark:bg-bg4Dark"
//                                                 >
//                                                    {item.icon}
//                                                 </div>
//                                              )}
//                                              <div className="space-y-0.5 truncate">
//                                                 <div className="font-bold text-zinc-500 dark:text-zinc-300">
//                                                    {item.label}
//                                                 </div>
//                                                 <div className="text-1 truncate text-xs">
//                                                    {item.description}
//                                                 </div>
//                                              </div>
//                                           </button>
//                                        );
//                                     }
//                                  )}
//                               </div>
//                            </div>
//                         );
//                      })}
//                   </div>
//                </>
//             </Popover.Panel>
//          </Float>
//       </>
//    )}
// </Popover>
