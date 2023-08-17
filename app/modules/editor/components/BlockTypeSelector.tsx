import { Fragment } from "react";

import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import {
   CheckSquare,
   Codesandbox,
   Heading2,
   Heading3,
   ImagePlus,
   LayoutList,
   List,
   Plus,
   Type,
   Youtube,
} from "lucide-react";
import { nanoid } from "nanoid";

import { CustomBlocksAddConfig } from "~/_custom/blocks";
import Tooltip from "~/components/Tooltip";

import type { CustomElement } from "../types";
import { BlockType } from "../types";

type Props = {
   onSelect: (block: CustomElement) => void;
};

export const BlockTypeSelector = ({ onSelect }: Props) => {
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
               children: [{ text: "" }],
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
               description: "Embed from URL",
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

   //If custom site has blocks, add to select options
   const customBlocks = CustomBlocksAddConfig(onSelect);
   if (customBlocks) {
      groups.push(customBlocks);
   }

   return (
      <Popover>
         {({ open }) => (
            <>
               <Float
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                  placement="bottom-start"
                  offset={5}
                  portal
               >
                  <Popover.Button
                     className="hover:bg-2 flex h-7 w-7 items-center justify-center focus:outline-none"
                     aria-label="Insert block below"
                  >
                     <Plus
                        className={`${
                           open ? "rotate-45 text-red-400" : ""
                        } transform transition duration-300 ease-in-out`}
                        size={16}
                     />
                  </Popover.Button>
                  <Popover.Panel
                     className="border-color shadow-1 bg-2 transform
                  overflow-hidden rounded-lg border shadow laptop:w-screen laptop:max-w-[770px]"
                  >
                     <>
                        <div className="relative h-12 text-sm">
                           <input
                              className="bg-2 h-full w-full px-4 focus:outline-none"
                              placeholder="Search..."
                           />
                        </div>
                        <div className="bg-3 border-color inline-flex w-full gap-3 border-y p-3">
                           {primary?.map((row) => (
                              <Tooltip
                                 key={row.label}
                                 id="primary"
                                 side="top"
                                 content={row.label}
                              >
                                 <button
                                    className="bg-2 shadow-1 border-color flex h-10 w-10 items-center justify-center rounded-lg border text-center shadow-sm"
                                    onClick={row.onSelect}
                                 >
                                    {row.icon}
                                 </button>
                              </Tooltip>
                           ))}
                        </div>
                        <div className="space-y-4 p-3">
                           {groups.map((group, indexGroup) => {
                              return (
                                 <div key={indexGroup} className="">
                                    <div className="text-1 pb-2 pl-2 text-xs font-bold">
                                       {group?.label}
                                    </div>
                                    <div className="grid gap-3 laptop:grid-cols-3">
                                       {groups[indexGroup]?.items?.map(
                                          (item, indexItem) => {
                                             return (
                                                <button
                                                   className="bg-3 shadow-1 flex cursor-pointer items-center gap-2 rounded-lg p-2 text-left
                                                   text-xs shadow-sm outline-none hover:bg-zinc-50 dark:hover:bg-bg3Dark"
                                                   key={indexItem}
                                                   onClick={item.onSelect}
                                                >
                                                   {item.icon && (
                                                      <div
                                                         className="flex h-8 w-8 items-center justify-center
                                                         rounded-lg bg-zinc-100 dark:bg-bg4Dark"
                                                      >
                                                         {item.icon}
                                                      </div>
                                                   )}
                                                   <div className="space-y-0.5 truncate">
                                                      <div className="font-bold text-zinc-500 dark:text-zinc-300">
                                                         {item.label}
                                                      </div>
                                                      <div className="text-1 truncate text-xs">
                                                         {item.description}
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
                     </>
                  </Popover.Panel>
               </Float>
            </>
         )}
      </Popover>
   );
};
