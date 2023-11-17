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
         icon: <Icon name="type" size={18} />,
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
         icon: <Icon name="heading-2" size={18} />,
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
         icon: <Icon name="heading-3" size={18} />,
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
         icon: <Icon name="list" size={18} />,
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
         icon: <Icon name="list-ordered" size={18} />,
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
         icon: <Icon name="code" size={18} />,
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
         label: "Image",
         icon: <Icon name="image-plus" size={18} />,
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
                     name="columns"
                     title="Info Box"
                     className="text-blue-500"
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
               mainAxis: 9,
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
                                                bg-white text-center shadow-sm dark:border-dark500/50 dark:bg-dark450 dark:hover:bg-dark500"
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
                                                               false,
                                                            );
                                                         }}
                                                      >
                                                         <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2 pb-1">
                                                               {item.icon && (
                                                                  <div
                                                                     className="flex h-5 w-5 border border-zinc-200 dark:border-transparent 
                                                                     bg-white items-center justify-center dark:bg-dark450 rounded"
                                                                  >
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
