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
import type {
   CustomElement,
   TableBodyElement,
   TableCellElement,
   TableElement,
   TableHeaderCellElement,
   TableRowElement,
} from "../../core/types";

export function BlockTable({
   attributes,
   children,
   element,
}: RenderElementProps & {
   element: TableElement;
}) {
   const editor = useSlateStatic();
   const [isSelecting] = TableCursor.selection(editor);
   const inTable = TableCursor.isInTable(editor);
   const path = ReactEditor.findPath(editor, element);
   const tableStyle = element.tableStyle;

   return (
      <>
         <table
            className={clsx(
               element.tableLayout === "fixed" && "table-fixed",
               element.tableLayout === "auto" && "table-auto",
               tableStyle === "rounded" && "rounded-table",
               tableStyle === "default" && "default-table",
               isSelecting && "table-selection-none",
               "mb-4 w-full relative overflow-hidden",
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
                           <TooltipTrigger asChild title="Row options">
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
                           <TooltipTrigger asChild title="Column options">
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
                           <TooltipTrigger asChild title="Table options">
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
                           <DropdownSection aria-label="Cell">
                              <DropdownHeading>Table Style</DropdownHeading>
                              <DropdownItem
                                 className="flex justify-between"
                                 onClick={() =>
                                    Transforms.setNodes<CustomElement>(
                                       editor,
                                       {
                                          tableStyle: "default",
                                       },
                                       {
                                          at: path,
                                       },
                                    )
                                 }
                              >
                                 {element.tableStyle === "default" && (
                                    <Icon
                                       size={14}
                                       name="check"
                                       title="Active"
                                    />
                                 )}
                                 <span className="flex-grow">Default</span>
                              </DropdownItem>
                              <DropdownItem
                                 className="flex justify-between"
                                 onClick={() =>
                                    Transforms.setNodes<CustomElement>(
                                       editor,
                                       {
                                          tableStyle: "rounded",
                                       },
                                       {
                                          at: path,
                                       },
                                    )
                                 }
                              >
                                 {element.tableStyle === "rounded" && (
                                    <Icon
                                       size={14}
                                       name="check"
                                       title="Active"
                                    />
                                 )}
                                 <span className="flex-grow">Rounded</span>
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
}: RenderElementProps & {
   element: TableHeaderCellElement;
}) {
   if (element.type !== "header-cell") {
      throw new Error('Element "Th" must be of type "header-cell"');
   }

   useSlateSelection();
   const editor = useSlateStatic();
   const selected = TableCursor.isSelected(editor, element);

   const align = element.align || "left";
   const path = ReactEditor.findPath(editor, element);
   const inTable = TableCursor.isInTable(editor);

   return (
      <th
         className={clsx(
            selected &&
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-blue-700/20",
            align === "center" && "text-center",
            align === "right" && "text-right",
            align === "left" && "text-left",
            "bg-2-sub px-3 py-2.5 text-left font-semibold relative",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
         {inTable && (
            <Dropdown>
               <Tooltip placement="top">
                  <TooltipTrigger asChild title="Table options">
                     <DropdownButton
                        className="!px-1.5 group-hover:block  !absolute top-2.5 right-1.5"
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
                     <DropdownHeading>Align</DropdownHeading>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "left",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Left</span>
                     </DropdownItem>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "center",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Center</span>
                     </DropdownItem>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "right",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Right</span>
                     </DropdownItem>
                  </DropdownSection>
               </DropdownMenu>
            </Dropdown>
         )}
      </th>
   );
}

export function BlockTableCell({
   attributes,
   element,
   children,
}: RenderElementProps & {
   element: TableCellElement;
}) {
   if (element.type !== "table-cell") {
      throw new Error('Element "Td" must be of type "table-cell"');
   }

   useSlateSelection();
   const editor = useSlateStatic();
   const selected = TableCursor.isSelected(editor, element);
   const inTable = TableCursor.isInTable(editor);

   const path = ReactEditor.findPath(editor, element);

   const align = element.align || "left";

   return (
      <td
         className={clsx(
            selected &&
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-blue-700/20",
            align === "center" && "text-center",
            align === "right" && "text-right",
            align === "left" && "text-left",
            "bg-3  px-3 py-2.5 relative group",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
         {inTable && (
            <Dropdown>
               <Tooltip placement="top">
                  <TooltipTrigger asChild title="Table options">
                     <DropdownButton
                        className="!px-1.5 group-hover:block  !absolute top-2.5 right-1.5"
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
                     <DropdownHeading>Align</DropdownHeading>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "left",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Left</span>
                     </DropdownItem>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "center",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Center</span>
                     </DropdownItem>
                     <DropdownItem
                        className="flex justify-between"
                        onClick={() =>
                           Transforms.setNodes<CustomElement>(
                              editor,
                              {
                                 align: "right",
                              },
                              {
                                 at: path,
                              },
                           )
                        }
                     >
                        <span className="flex-grow">Right</span>
                     </DropdownItem>
                  </DropdownSection>
               </DropdownMenu>
            </Dropdown>
         )}
      </td>
   );
}

export function BlockTableRow({
   attributes,
   element,
   children,
}: RenderElementProps & {
   element: TableRowElement;
}) {
   if (element.type !== "table-row") {
      throw new Error('Element "Tr" must be of type "table-row"');
   }

   return <tr {...attributes}>{children}</tr>;
}

export function BlockTableBody({
   attributes,
   element,
   children,
}: RenderElementProps & {
   element: TableBodyElement;
}) {
   if (element.type !== "table-body") {
      throw new Error('Element "Tbody" must be of type "table-body"');
   }

   return <tbody {...attributes}>{children}</tbody>;
}
