import clsx from "clsx";
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
   const align = element.align || "left";

   return (
      <th
         className={clsx(
            align === "center" && "text-center",
            align === "right" && "text-right",
            align === "left" && "text-left",
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

export function BlockTableCellView({
   attributes,
   element,
   children,
}: RenderElementProps) {
   if (element.type !== "table-cell") {
      throw new Error('Element "Td" must be of type "table-cell"');
   }
   const align = element.align || "left";

   return (
      <td
         className={clsx(
            align === "center" && "text-center",
            align === "right" && "text-right",
            align === "left" && "text-left",
            "bg-3 border border-zinc-200 p-3 dark:border-zinc-700 relative group",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </td>
   );
}
