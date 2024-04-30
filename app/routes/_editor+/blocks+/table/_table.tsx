import clsx from "clsx";
import type { RenderElementProps } from "slate-react";
import { useSlateSelection, useSlateStatic } from "slate-react";

import { Icon } from "~/components/Icon";

import { TableCursor } from "./src/table-cursor";
import { TableEditor } from "./src/table-editor";

export function BlockTable({
   attributes,
   children,
   element,
}: RenderElementProps) {
   const editor = useSlateStatic();
   const [isSelecting] = TableCursor.selection(editor);
   const inTable = TableCursor.isInTable(editor);
   return (
      <>
         <table
            className={clsx(
               isSelecting && "table-selection-none",
               "table-auto my-4 w-full relative",
            )}
            {...attributes}
         >
            {children}
         </table>
         {inTable && (
            <div
               contentEditable={false}
               className="flex items-start justify-between gap-3 w-full -mt-4"
            >
               <div
                  className="flex items-center divide-x divide-color-sub border border-t-0 border-color-sub 
                  bg-zinc-50 dark:bg-dark350 rounded-b-lg overflow-hidden"
               >
                  <button
                     type="button"
                     onClick={(event) => {
                        TableEditor.merge(editor);
                        event.preventDefault();
                     }}
                     className="flex items-center gap-1.5 py-2 px-3 hover:bg-zinc-100 dark:hover:bg-dark400"
                  >
                     <Icon
                        size={14}
                        name="table-cells-merge"
                        className="flex-none text-indigo-500"
                     />
                     <span className="text-xs max-tablet:hidden">Merge</span>
                  </button>
                  <button
                     type="button"
                     onClick={(event) => {
                        TableEditor.split(editor);
                        event.preventDefault();
                     }}
                     className="flex items-center gap-1.5 py-2 px-3 hover:bg-zinc-100 dark:hover:bg-dark400"
                  >
                     <Icon
                        size={14}
                        name="table-cells-split"
                        className="flex-none text-fuchsia-500"
                     />
                     <span className="text-xs max-tablet:hidden">Split</span>
                  </button>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex items-center overflow-hidden gap-2 border border-t-0 border-color-sub bg-zinc-50 dark:bg-dark350 rounded-b-lg pr-2">
                     <div className="p-2.5 border-r border-color-sub bg-cyan-50/50 dark:bg-cyan-950/20">
                        <Icon
                           size={14}
                           name="rows"
                           className="flex-none text-cyan-500"
                        />
                     </div>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.insertRow(editor, { before: true });
                           event.preventDefault();
                        }}
                        className="flex items-center gap-1 bg-white border-zinc-100 dark:border-transparent hover:border-zinc-200 dark:hover:border-transparent 
                     border border-transparent dark:bg-dark400 dark:hover:bg-dark450 rounded-full pl-2.5 tablet:pl-1.5 pr-2.5 py-0.5"
                     >
                        <Icon
                           size={12}
                           name="chevron-up"
                           className="flex-none"
                        />
                        <span className="text-[10px] flex-none max-tablet:hidden">
                           Top
                        </span>
                     </button>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.insertRow(editor);
                           event.preventDefault();
                        }}
                        className="flex items-center gap-1 bg-white border-zinc-100 dark:border-transparent hover:border-zinc-200 dark:hover:border-transparent 
                     border border-transparent dark:bg-dark400 dark:hover:bg-dark450 rounded-full pl-2.5 tablet:pl-1.5 pr-2.5 py-0.5"
                     >
                        <Icon
                           size={12}
                           name="chevron-down"
                           className="flex-none"
                        />
                        <span className="text-[10px] flex-none max-tablet:hidden">
                           Bottom
                        </span>
                     </button>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.removeRow(editor);
                           event.preventDefault();
                        }}
                        className="p-0.5 border border-transparent rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-950/75"
                     >
                        <Icon
                           size={12}
                           name="x"
                           title="Delete row"
                           className="flex-none text-red-400"
                        />
                     </button>
                  </div>
                  <div className="flex items-center overflow-hidden gap-2 border border-t-0 border-color-sub bg-zinc-50 dark:bg-dark350 rounded-b-lg pr-2">
                     <div className="p-2.5 border-r border-color-sub bg-amber-50/50 dark:bg-amber-950/20">
                        <Icon
                           size={14}
                           name="columns"
                           className="flex-none text-amber-500"
                        />
                     </div>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.insertColumn(editor, { before: true });
                           event.preventDefault();
                        }}
                        className="flex items-center gap-1 bg-white border-zinc-100 dark:border-transparent hover:border-zinc-200 dark:hover:border-transparent 
                     border border-transparent dark:bg-dark400 dark:hover:bg-dark450 rounded-full pl-2.5 tablet:pl-1.5 pr-2.5 py-0.5"
                     >
                        <Icon
                           size={12}
                           name="chevron-left"
                           className="flex-none"
                        />
                        <span className="text-[10px] flex-none max-tablet:hidden">
                           Left
                        </span>
                     </button>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.insertColumn(editor);
                           event.preventDefault();
                        }}
                        className="flex items-center gap-1 bg-white border-zinc-100 dark:border-transparent hover:border-zinc-200 dark:hover:border-transparent 
                     border border-transparent dark:bg-dark400 dark:hover:bg-dark450 rounded-full pl-2.5 tablet:pl-1.5 pr-2.5 py-0.5"
                     >
                        <Icon
                           size={12}
                           name="chevron-right"
                           className="flex-none"
                        />
                        <span className="text-[10px] flex-none max-tablet:hidden">
                           Right
                        </span>
                     </button>
                     <button
                        type="button"
                        onClick={(event) => {
                           TableEditor.removeColumn(editor);
                           event.preventDefault();
                        }}
                        className="p-0.5 border border-transparent rounded bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-950/75"
                     >
                        <Icon
                           size={12}
                           name="x"
                           title="Delete row"
                           className="flex-none text-red-400"
                        />
                     </button>
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
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-dark350",
            "bg-2-sub border border-zinc-200 p-3 dark:border-zinc-700",
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
               "bg-zinc-100 border-blue-300 dark:border-blue-800 dark:bg-dark350",
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
