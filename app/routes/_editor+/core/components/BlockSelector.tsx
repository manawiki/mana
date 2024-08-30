import { useState } from "react";

import { FloatingDelayGroup } from "@floating-ui/react";
import { nanoid } from "nanoid";
import type { Editor } from "slate";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

// import { CustomBlocksAddConfig } from "~/_custom/blocks";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import { MobileTray } from "~/routes/_site+/_components/MobileTray";

import type { CustomElement } from "../types";
import { BlockType } from "../types";

type Props = {
   element: CustomElement;
   editor: Editor;
   isSelectorOpen: boolean;
};

export function BlockSelector({ element, editor, isSelectorOpen }: Props) {
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
         label: "Linking",
         items: [
            {
               label: "Group",
               icon: (
                  <Icon
                     name="layout-list"
                     title="Group"
                     className="text-yellow-500"
                     size={14}
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
         ],
      },
      {
         label: "Structure",
         items: [
            {
               label: "Tabs",
               icon: (
                  <Icon
                     name="rectangle-horizontal"
                     title="Tabs"
                     className="text-orange-500"
                     size={14}
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
               label: "Table",
               icon: (
                  <Icon
                     name="table"
                     title="Table"
                     className="text-teal-500"
                     size={14}
                  />
               ),
               description: "Format elements in a table",
               onSelect: () => {
                  onInsertBelow({
                     type: BlockType.Table,
                     id: nanoid(),
                     tableLayout: "fixed",
                     tableStyle: "rounded",
                     children: [
                        //@ts-ignore
                        {
                           type: BlockType.TableBody,
                           children: [
                              {
                                 type: BlockType.TableRow,
                                 children: [
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
                                    },
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
                                    },
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
                                    },
                                 ],
                              },
                              {
                                 type: BlockType.TableRow,
                                 children: [
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
                                    },
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
                                    },
                                    {
                                       type: BlockType.TableCell,
                                       children: [
                                          {
                                             type: BlockType.TableContent,
                                             children: [{ text: "" }],
                                          },
                                       ],
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
                     size={14}
                  />
               ),
               description: "Structure elements in two-columns",
               onSelect: () => {
                  onInsertBelow({
                     id: nanoid(),
                     type: BlockType.TwoColumn,
                     children: [{ text: "" }],
                  });
               },
            },
         ],
      },
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
               label: "Event Timeline",
               icon: (
                  <Icon
                     name="calendar-clock"
                     title="Event Timeline"
                     className="text-emerald-500"
                     size={14}
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
         ],
      },
      {
         label: "Monetization",
         items: [
            {
               label: "Ad Unit",
               icon: (
                  <Icon
                     name="coins"
                     title="Ad Unit"
                     className="text-amber-400"
                     size={14}
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

   const [isEditorTrayOpen, setEditorTray] = useState(false);

   return (
      <>
         {!isSelectorOpen && (
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
         )}
         <MobileTray
            onOpenChange={setEditorTray}
            open={isEditorTrayOpen}
            direction="right"
         >
            <div className="relative z-10 grid-cols-2 grid gap-3">
               <FloatingDelayGroup delay={{ open: 1000, close: 200 }}>
                  {primary?.map((row) => (
                     <Tooltip key={row.label}>
                        <TooltipTrigger asChild>
                           <button
                              className="shadow-1 flex h-10 w-full items-center rounded-lg border text-xs gap-1 pl-2 pr-3
                                                bg-zinc-50 text-center shadow-sm dark:border-dark500/50 dark:bg-dark450 dark:hover:bg-dark500"
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
                        <TooltipContent>{row.label}</TooltipContent>
                     </Tooltip>
                  ))}
               </FloatingDelayGroup>
            </div>
            <div className="space-y-4 pt-2">
               {groups.map((group, indexGroup) => {
                  return (
                     <div key={indexGroup} className="pt-4">
                        <div className="pb-2 pl-0.5 text-left text-xs font-bold">
                           {group?.label}
                        </div>
                        <div className="space-y-2.5">
                           {groups[indexGroup]?.items?.map(
                              (item, indexItem) => {
                                 return (
                                    <button
                                       className="border-color flex cursor-pointer items-center w-full shadow-zinc-100 hover:border-zinc-200
                                                          laptop:justify-start gap-2.5 rounded-xl border bg-zinc-50 p-2.5 group dark:shadow-zinc-800
                                                shadow-sm outline-none dark:border-zinc-600/40 dark:bg-dark400 dark:hover:bg-dark450"
                                       key={indexItem}
                                       onClick={() => {
                                          item.onSelect();
                                          setEditorTray(false);
                                       }}
                                    >
                                       {item.icon && (
                                          <div
                                             className="flex size-8 border border-zinc-200 dark:border-transparent dark:group-hover:bg-dark500
                                                                     bg-white items-center justify-center dark:bg-dark450 rounded-lg"
                                          >
                                             {item.icon}
                                          </div>
                                       )}
                                       <div className="space-y-0.5">
                                          <div className="font-bold text-left text-xs">
                                             {item.label}
                                          </div>
                                          <div className="text-1 text-[10px]">
                                             {item.description}
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
         </MobileTray>
      </>
   );
}
