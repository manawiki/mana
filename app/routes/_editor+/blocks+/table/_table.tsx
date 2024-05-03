import clsx from "clsx";
import { Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { ReactEditor, useSlateSelection, useSlateStatic } from "slate-react";

import {
   Dropdown,
   DropdownButton,
   DropdownHeading,
   DropdownItem,
   DropdownMenu,
   DropdownSection,
   DropdownSeparator,
} from "~/components/Dropdown";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

import { TableCursor } from "./src/table-cursor";
import { TableEditor } from "./src/table-editor";
import type { CustomElement } from "../../core/types";

export function BlockTable({
   attributes,
   children,
   element,
}: RenderElementProps) {
   const editor = useSlateStatic();
   const [isSelecting] = TableCursor.selection(editor);
   const inTable = TableCursor.isInTable(editor);
   const path = ReactEditor.findPath(editor, element);

   return (
      <>
         <table
            className={clsx(
               //@ts-ignore
               element.tableLayout === "fixed" && "table-fixed",
               //@ts-ignore
               element.tableLayout === "auto" && "table-auto",
               isSelecting && "table-selection-none",
               "my-4 w-full relative",
            )}
            {...attributes}
         >
            {children}
         </table>
         {inTable && (
            <div
               contentEditable={false}
               className="flex items-start justify-center gap-3 w-full -mt-4 z-50 mb-4"
            >
               <div className="flex items-center gap-2">
                  <div
                     className="flex items-center overflow-hidden shadow-sm shadow-1 border border-t-0 border-color-sub 
                     bg-zinc-50 dark:bg-dark350 rounded-b-lg p-1.5 pl-2"
                  >
                     <div className="flex items-center gap-1">
                        <Tooltip placement="top">
                           <TooltipTrigger
                              title="Merge"
                              onClick={() => {
                                 TableEditor.merge(editor);
                              }}
                              className="p-1.5 dark:hover:bg-dark500 rounded-lg"
                           >
                              <Icon
                                 size={16}
                                 name="table-cells-merge"
                                 title="Merge"
                                 className="flex-none text-indigo-500"
                              />
                           </TooltipTrigger>
                           <TooltipContent>Merge</TooltipContent>
                        </Tooltip>
                        <Tooltip placement="top">
                           <TooltipTrigger
                              title="Split"
                              className="p-1.5 dark:hover:bg-dark500 rounded-lg"
                              onClick={() => {
                                 TableEditor.split(editor);
                              }}
                           >
                              <Icon
                                 size={15.5}
                                 name="table-cells-split"
                                 title="Split"
                                 className="flex-none text-fuchsia-500"
                              />
                           </TooltipTrigger>
                           <TooltipContent>Split</TooltipContent>
                        </Tooltip>
                     </div>
                     <div className="mx-2 h-5 w-[1px] rounded-lg dark:bg-dark500" />
                     <Dropdown>
                        <Tooltip placement="top">
                           <TooltipTrigger title="Row options">
                              <DropdownButton
                                 className="!px-1.5"
                                 plain
                                 aria-label="Row options"
                              >
                                 <Icon
                                    size={14}
                                    name="rows"
                                    className="flex-none text-cyan-500"
                                 />
                                 <Icon
                                    size={12}
                                    className="text-1"
                                    name="chevron-down"
                                 />
                              </DropdownButton>
                           </TooltipTrigger>
                           <TooltipContent>Row Options</TooltipContent>
                        </Tooltip>
                        <DropdownMenu className="z-50" anchor="bottom end">
                           <DropdownSection aria-label="Cell">
                              <DropdownHeading>Cell row</DropdownHeading>
                              <DropdownItem
                                 onClick={() =>
                                    TableEditor.insertRow(editor, {
                                       before: true,
                                    })
                                 }
                              >
                                 Insert top
                              </DropdownItem>
                              <DropdownItem
                                 onClick={() => TableEditor.insertRow(editor)}
                              >
                                 Insert bottom
                              </DropdownItem>
                           </DropdownSection>
                           <DropdownSeparator />
                           <DropdownSection aria-label="Cell">
                              <DropdownHeading>Header row</DropdownHeading>
                              <DropdownItem
                                 onClick={() =>
                                    TableEditor.insertRow(editor, {
                                       before: true,
                                       isHeader: true,
                                    })
                                 }
                              >
                                 Insert top
                              </DropdownItem>
                              <DropdownItem
                                 onClick={() =>
                                    TableEditor.insertRow(editor, {
                                       isHeader: true,
                                    })
                                 }
                              >
                                 Insert bottom
                              </DropdownItem>
                           </DropdownSection>
                           <DropdownSeparator />
                           <DropdownItem
                              onClick={(event) => {
                                 TableEditor.removeRow(editor);
                                 event.preventDefault();
                              }}
                              className="flex items-center justify-between gap-2 w-full"
                           >
                              Delete Row
                           </DropdownItem>
                        </DropdownMenu>
                     </Dropdown>
                     <Dropdown>
                        <Tooltip placement="top">
                           <TooltipTrigger title="Column options">
                              <DropdownButton
                                 className="!px-1.5"
                                 plain
                                 aria-label="Column options"
                              >
                                 <Icon
                                    size={14}
                                    name="columns"
                                    title="Column Options"
                                    className="flex-none text-amber-500"
                                 />
                                 <Icon
                                    size={12}
                                    className="text-1"
                                    name="chevron-down"
                                 />
                              </DropdownButton>
                           </TooltipTrigger>
                           <TooltipContent>Column Options</TooltipContent>
                        </Tooltip>
                        <DropdownMenu className="z-50" anchor="bottom end">
                           <DropdownSection aria-label="Cell">
                              <DropdownItem
                                 onClick={() =>
                                    TableEditor.insertColumn(editor, {
                                       before: true,
                                    })
                                 }
                              >
                                 Insert to left
                              </DropdownItem>
                              <DropdownItem
                                 onClick={() =>
                                    TableEditor.insertColumn(editor)
                                 }
                              >
                                 Insert to right
                              </DropdownItem>
                           </DropdownSection>
                           <DropdownSeparator />
                           <DropdownItem
                              onClick={(event) => {
                                 TableEditor.removeColumn(editor);
                              }}
                              className="flex items-center justify-between gap-2 w-full"
                           >
                              Delete Column
                           </DropdownItem>
                        </DropdownMenu>
                     </Dropdown>
                     <Dropdown>
                        <Tooltip placement="top">
                           <TooltipTrigger title="Table options">
                              <DropdownButton
                                 className="!px-1.5"
                                 plain
                                 aria-label="Table options"
                              >
                                 <Icon
                                    size={14}
                                    name="more-vertical"
                                    title="Table Options"
                                 />
                              </DropdownButton>
                           </TooltipTrigger>
                           <TooltipContent>Table Options</TooltipContent>
                        </Tooltip>
                        <DropdownMenu className="z-50" anchor="bottom end">
                           <DropdownSection aria-label="Cell">
                              <DropdownHeading>Table Layout</DropdownHeading>
                              <DropdownItem
                                 className="flex justify-between"
                                 onClick={() =>
                                    Transforms.setNodes<CustomElement>(
                                       editor,
                                       {
                                          tableLayout: "fixed",
                                       },
                                       {
                                          at: path,
                                       },
                                    )
                                 }
                              >
                                 {/* @ts-ignore */}
                                 {element.tableLayout === "fixed" && (
                                    <Icon
                                       size={14}
                                       name="check"
                                       title="Active"
                                    />
                                 )}
                                 <span className="flex-grow">Fixed</span>
                              </DropdownItem>
                              <DropdownItem
                                 className="flex justify-between"
                                 onClick={() =>
                                    Transforms.setNodes<CustomElement>(
                                       editor,
                                       {
                                          tableLayout: "auto",
                                       },
                                       {
                                          at: path,
                                       },
                                    )
                                 }
                              >
                                 {/* @ts-ignore */}
                                 {element.tableLayout === "auto" && (
                                    <Icon
                                       size={14}
                                       name="check"
                                       title="Active"
                                    />
                                 )}
                                 <span className="flex-grow">Auto</span>
                              </DropdownItem>
                           </DropdownSection>
                        </DropdownMenu>
                     </Dropdown>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}

export function BlockTableHeaderCell({
   attributes,
   element,
   children,
}: RenderElementProps) {
   if (element.type !== "header-cell") {
      throw new Error('Element "Th" must be of type "header-cell"');
   }

   useSlateSelection();
   const editor = useSlateStatic();
   const selected = TableCursor.isSelected(editor, element);

   return (
      <th
         className={clsx(
            selected &&
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-blue-700/20",
            "bg-2-sub border border-zinc-200 p-3 dark:border-zinc-700 text-left font-semibold",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </th>
   );
}

export function BlockTableCell({
   attributes,
   element,
   children,
}: RenderElementProps) {
   if (element.type !== "table-cell") {
      throw new Error('Element "Td" must be of type "table-cell"');
   }

   useSlateSelection();
   const editor = useSlateStatic();
   const selected = TableCursor.isSelected(editor, element);

   return (
      <td
         className={clsx(
            selected &&
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-blue-700/20",
            "bg-3 border border-zinc-200 p-3 dark:border-zinc-700 relative",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </td>
   );
}
