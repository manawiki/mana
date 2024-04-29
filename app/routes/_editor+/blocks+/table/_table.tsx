import clsx from "clsx";
import type { RenderElementProps } from "slate-react";
import { useSlateSelection, useSlateStatic } from "slate-react";

import { TableCursor } from "./src/table-cursor";

export function BlockTable({ attributes, children }: RenderElementProps) {
   const editor = useSlateStatic();
   const [isSelecting] = TableCursor.selection(editor);

   return (
      <table
         className={clsx(
            isSelecting && "table-selection-none",
            "table-fixed my-4 w-full",
         )}
         {...attributes}
      >
         {children}
      </table>
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
            selected && "bg-sky-200",
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
            selected && "bg-sky-200",
            "bg-3 border border-zinc-200 p-3 dark:border-zinc-700",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </td>
   );
}
