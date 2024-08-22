import { type Table as TableType, flexRender } from "@tanstack/react-table";

export function GridView({ table }: { table: TableType<any> }) {
   return (
      <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4  gap-3">
         {table.getRowModel().rows.map((row) => {
            return (
               <div
                  className="p-2 dark:hover:border-zinc-600 border rounded-md bg-zinc-50 truncate
                  dark:bg-dark350 border-color-sub shadow-sm dark:shadow-zinc-800/80 hover:border-zinc-300"
                  key={row.id}
               >
                  {flexRender(
                     row.getVisibleCells()[0]?.column.columnDef.cell,
                     //@ts-ignore
                     row.getVisibleCells()[0]?.getContext(),
                  )}
               </div>
            );
         })}
      </div>
   );
}
