import clsx from "clsx";
import type { RenderElementProps } from "slate-react";

export function BlockTableView({
   attributes,
   children,
   element,
}: RenderElementProps) {
   const tableStyle = element.tableStyle;
   const tableLayout = element.tableLayout;

   return (
      <>
         <table
            className={clsx(
               tableLayout === "fixed" && "table-fixed",
               tableLayout === "auto" && "table-auto",
               tableStyle === "rounded" && "rounded-table",
               tableStyle === "default" && "default-table",
               "mb-4 w-full relative overflow-hidden",
            )}
            {...attributes}
         >
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
            "bg-2-sub px-3 py-2.5 text-left font-semibold relative",
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
            "bg-3  px-3 py-2.5 relative group",
         )}
         rowSpan={element.rowSpan}
         colSpan={element.colSpan}
         {...attributes}
      >
         {children}
      </td>
   );
}
