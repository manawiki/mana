import { type TableType, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { Icon } from "~/components/Icon";

export function ListView({ table }: { table: TableType<any> }) {
   return (
      <div
         className="max-tablet:overflow-x-auto whitespace-nowrap scrollbar 
       dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
       scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 w-full"
      >
         <div className="table min-w-full relative">
            {/* Table Header */}
            <div className="table-header-group tablet:sticky top-[110px] bg-3">
               {table.getHeaderGroups().map((headerGroup) => (
                  <div className="table-row" key={headerGroup.id}>
                     {headerGroup.headers.map((header) => (
                        <span
                           className="table-cell align-bottom dark:text-zinc-400 text-zinc-500
                           font-bold p-1 pt-2 border-color-sub text-sm border-b"
                           key={header.id}
                        >
                           {header.isPlaceholder ? null : (
                              <div
                                 className={clsx(
                                    header.column.getCanSort()
                                       ? "cursor-pointer select-none"
                                       : "",
                                    "flex items-center gap-1.5",
                                 )}
                                 onClick={header.column.getToggleSortingHandler()}
                                 title={
                                    header.column.getCanSort()
                                       ? header.column.getNextSortingOrder() ===
                                         "asc"
                                          ? "Sort ascending"
                                          : header.column.getNextSortingOrder() ===
                                              "desc"
                                            ? "Sort descending"
                                            : "Clear sort"
                                       : undefined
                                 }
                              >
                                 {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                 )}
                                 {{
                                    asc: <Icon name="chevron-up" size={14} />,
                                    desc: (
                                       <Icon name="chevron-down" size={14} />
                                    ),
                                 }[header.column.getIsSorted() as string] ??
                                    null}
                              </div>
                           )}
                        </span>
                     ))}
                  </div>
               ))}
            </div>
            <div className="table-row-group">
               {table.getRowModel().rows.map((row) => {
                  return (
                     <div
                        className="table-row even:bg-zinc-50 dark:even:bg-dark350"
                        key={row.id}
                     >
                        {row.getVisibleCells().map((cell) => {
                           return (
                              <span
                                 className="table-cell align-middle text-sm p-1"
                                 key={cell.id}
                              >
                                 {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                 )}
                              </span>
                           );
                        })}
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
