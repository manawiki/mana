import type { RenderElementProps } from "slate-react";

export function BlockTableView({ attributes, children }: RenderElementProps) {
   return (
      <>
         <table className="table-auto my-4 w-full relative" {...attributes}>
            {children}
         </table>
      </>
   );
}

export function BlockTableHeaderCellView({
   attributes,
   element,
   children,
}: RenderElementProps) {
   if (element.type !== "header-cell") {
      throw new Error('Element "Th" must be of type "header-cell"');
   }
   return (
      <th
         className="bg-2-sub border border-zinc-200 p-3 dark:border-zinc-700 text-left font-semibold"
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </th>
   );
}

export function BlockTableCellView({
   attributes,
   element,
   children,
}: RenderElementProps) {
   if (element.type !== "table-cell") {
      throw new Error('Element "Td" must be of type "table-cell"');
   }

   return (
      <td
         className="bg-3 border border-zinc-200 p-3 dark:border-zinc-700 relative"
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </td>
   );
}
