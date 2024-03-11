import { Fragment } from "react";

import { FloatingDelayGroup, offset } from "@floating-ui/react";
import { Dialog, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { nanoid } from "nanoid";
import type { Editor } from "slate";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

// import { CustomBlocksAddConfig } from "~/_custom/blocks";
import { Icon } from "~/components/Icon";
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
      //@ts-ignore
      const path = [ReactEditor.findPath(editor, element)[0] + 1];
      Transforms.insertNodes(editor, block, {
         at: path,
      });
   }

   const primary = [
      {
         label: "Text",
         icon: <Icon name="text" className="text-1" size={14} />,
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
         icon: <Icon name="heading-2" className="text-1" size={14} />,
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
         label: "Image",
         icon: <Icon name="image-plus" className="text-1" size={14} />,
         description: "Embed an Image",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.Image,
               refId: null,
               url: null,
               caption: false,
               containerWidth: 728,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "Heading 3",
         icon: <Icon name="heading-3" className="text-1" size={14} />,
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
         icon: <Icon name="list" className="text-1" size={14} />,
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
         icon: <Icon name="list-ordered" className="text-1" size={14} />,
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
         label: "Code Block",
         icon: <Icon name="code" className="text-1" size={14} />,
         description: "A code block",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.CodeBlock,
               children: [{ text: "" }],
            });
         },
      },
      {
         label: "HTML Block",
         icon: <Icon name="file-code-2" className="text-1" size={14} />,
         description: "Embed a block of HTML code",
         onSelect: () => {
            onInsertBelow({
               id: nanoid(),
               type: BlockType.HTMLBlock,
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
               icon: (
                  <Icon
                     name="chevron-right"
                     title="Toggle Block"
                     className="text-purple-500"
                     size={16}
                  />
               ),
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
               label: "Info Box",
               icon: (
                  <Icon
                     name="rows"
                     title="Info Box"
                     className="text-pink-400"
                     size={12}
                  />
               ),
               description: "Add an infobox",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.InfoBox,
                     children: [
                        {
                           id: nanoid(),
                           type: BlockType.InfoBoxItem,
                           children: [],
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
                     ],
                  });
               },
            },
            {
               label: "Two Column",
               icon: (
                  <Icon
                     name="columns"
                     title="Two Columns"
                     className="text-blue-500"
                     size={12}
                  />
               ),
               description: "Implement a two-column layout",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.TwoColumn,
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Group",
               icon: (
                  <Icon
                     name="layout-list"
                     title="Group"
                     className="text-yellow-500"
                     size={12}
                  />
               ),
               description: "Embed collection data",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     itemsViewMode: "list",
                     type: BlockType.Group,
                     //@ts-ignore
                     children: [{ text: "" }],
                  });
               },
            },
            {
               label: "Event Timeline",
               icon: (
                  <Icon
                     name="calendar-clock"
                     title="Event Timeline"
                     className="text-emerald-500"
                     size={12}
                  />
               ),
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
            {
               label: "Tabs",
               icon: (
                  <Icon
                     name="rectangle-horizontal"
                     title="Tabs"
                     className="text-orange-500"
                     size={12}
                  />
               ),
               description: "Group elements with tabs",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.Tabs,
                     tabs: ["Tab 1", "Tab 2"],
                     children: [
                        {
                           //@ts-ignore
                           id: nanoid(),
                           type: BlockType.TabsItem,
                           children: [{ text: "" }],
                        },
                        {
                           id: nanoid(),
                           type: BlockType.TabsItem,
                           children: [{ text: "" }],
                        },
                     ],
                  });
               },
            },
            {
               label: "Ad Unit",
               icon: (
                  <Icon
                     name="lock"
                     title="Ad Unit"
                     className="text-red-400"
                     size={12}
                  />
               ),
               description: "Generate revenue with ads",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.InlineAd,
                     children: [{ text: "" }],
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
               mainAxis: 8,
               crossAxis: -30,
            }),
         ]}
         dialog
         placement="top-start"
         portal
         flip
      >
         <Float.Reference>
            <button
               type="button"
               onClick={() => setEditorTray(true)}
               className="flex h-7 w-7 items-center justify-center focus:outline-none"
               aria-label="Insert block below"
            >
               <Icon
                  name="plus"
                  className={`${
                     isEditorTrayOpen ? "rotate-45" : ""
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
                              className="dark:border-zinc-500/40 relative transform overflow-hidden rounded-b-xl rounded-t-xl border
                   border-zinc-200 bg-white drop-shadow-lg  dark:bg-dark350 laptop:w-[728px] laptop:max-w-[728px]"
                           >
                              <div className="bg-2-sub relative z-10 grid-cols-3 grid laptop:grid-cols-4 gap-3 p-3">
                                 <FloatingDelayGroup
                                    delay={{ open: 1000, close: 200 }}
                                 >
                                    {primary?.map((row) => (
                                       <Tooltip key={row.label}>
                                          <TooltipTrigger asChild>
                                             <button
                                                className="shadow-1 flex h-10 w-full items-center  rounded-lg border text-xs gap-1 pl-2 pr-3
                                                bg-white text-center shadow-sm dark:border-dark500/50 dark:bg-dark450 dark:hover:bg-dark500"
                                                onClick={() => {
                                                   row.onSelect();
                                                   setEditorTray(false);
                                                }}
                                             >
                                                <div className="size-5 flex items-center justify-center">
                                                   {row.icon}
                                                </div>
                                                <div className="flex-none truncate font-semibold">
                                                   {row.label}
                                                </div>
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
                              <div className="space-y-4 px-3 pt-2 pb-4">
                                 {groups.map((group, indexGroup) => {
                                    return (
                                       <div key={indexGroup} className="">
                                          <div className="pb-2 pl-2 text-left text-xs font-bold">
                                             {group?.label}
                                          </div>
                                          <div className="grid gap-3 grid-cols-3">
                                             {groups[indexGroup]?.items?.map(
                                                (item, indexItem) => {
                                                   return (
                                                      <button
                                                         className="border-color hover:shadow-1 shadow-1 flex cursor-pointer items-center
                                                          laptop:justify-start gap-2 max-laptop:justify-center rounded-xl border bg-zinc-50 p-3
                                                   laptop:text-left text-xs shadow-sm outline-none dark:border-zinc-600/40 dark:bg-dark400 dark:hover:bg-dark450"
                                                         key={indexItem}
                                                         onClick={() => {
                                                            item.onSelect();
                                                            setEditorTray(
                                                               false,
                                                            );
                                                         }}
                                                      >
                                                         <div className="space-y-0.5">
                                                            <div className="laptop:flex items-center gap-2 pb-1">
                                                               {item.icon && (
                                                                  <div
                                                                     className="flex h-5 w-5 border border-zinc-200 dark:border-transparent 
                                                                     bg-white items-center justify-center dark:bg-dark450 rounded max-laptop:mx-auto"
                                                                  >
                                                                     {item.icon}
                                                                  </div>
                                                               )}
                                                               <div className="font-bold max-laptop:pt-2">
                                                                  {item.label}
                                                               </div>
                                                            </div>
                                                            <div className="max-laptop:hidden text-1 text-xs">
                                                               {
                                                                  item.description
                                                               }
                                                            </div>
                                                         </div>
                                                      </button>
                                                   );
                                                },
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
