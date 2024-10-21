import type { TableType } from "@tanstack/react-table";
import clsx from "clsx";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";

export function ListPager({
   table,
   stickyFooter,
}: {
   table: TableType<any>;
   stickyFooter: boolean;
}) {
   return (
      <div
         className={clsx(stickyFooter ? "bottom-0 sticky bg-3 z-10 py-2" : "")}
      >
         <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-1 text-sm">
               <span className="text-1">Page</span>
               <div className="flex items-center gap-1">
                  <span className="font-semibold">
                     {table.getState().pagination.pageIndex + 1}
                  </span>
                  <span className="text-1">of</span>
                  <span className="font-semibold">
                     {table.getPageCount().toLocaleString()}
                  </span>
               </div>
               <span className="mx-1 size-1 bg-zinc-300 dark:bg-zinc-600 rounded-full" />
               <div className="flex items-center gap-1">
                  <span>{table.getRowCount().toLocaleString()}</span>
                  <span className="text-1">results</span>
               </div>
            </div>
            <div className="flex items-center gap-1">
               <Button
                  outline
                  className="!size-7 !p-0"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <Icon name="chevrons-left" size={16} />
               </Button>
               <Button
                  className="!size-7 !p-0"
                  outline
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
               >
                  <Icon name="chevron-left" size={16} />
               </Button>
               <Button
                  className="!size-7 !p-0"
                  outline
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <Icon name="chevron-right" size={16} />
               </Button>
               <Button
                  className="!size-7 !p-0"
                  outline
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
               >
                  <Icon name="chevrons-right" size={16} />
               </Button>
            </div>
         </div>
      </div>
   );
}
