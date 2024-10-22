import { useContext, useMemo, useState } from "react";

import {
   useReactTable,
   getCoreRowModel,
   getSortedRowModel,
   getFilteredRowModel,
   getPaginationRowModel,
} from "@tanstack/react-table";
import type {
   FilterFn,
   AccessorKeyColumnDefBase,
   VisibilityState,
   AccessorKeyColumnDef,
   ColumnFiltersState,
   SortingState,
   PaginationState,
} from "@tanstack/react-table";

import type { Collection } from "~/db/payload-types";

import { fuzzyFilter } from "./fuzzyFilter";
import { GridView } from "./GridView";
import type { TableFilters } from "./List";
import { ListTop } from "./ListTop";
import { ListPager } from "./ListPager";
import { ListView } from "./ListView";
import { TableFilterContext } from "./ListTableContainer";

export function ListTable({
   data,
   columns,
   collection,
   columnViewability,
   filters,
   defaultViewType,
   gridView,
   defaultSort,
   searchPlaceholder,
   gridCellClassNames,
   gridContainerClassNames,
   pager = true,
   pageSize = 60,
   globalFilterFn,
   stickyFooter = false,
}: {
   data: any;
   columns: AccessorKeyColumnDefBase<any>[] | any;
   collection?: Collection;
   columnViewability?: VisibilityState;
   defaultViewType?: "list" | "grid";
   filters?: TableFilters | any;
   gridView?: AccessorKeyColumnDef<any>;
   defaultSort?: SortingState;
   searchPlaceholder?: string;
   gridCellClassNames?: string;
   gridContainerClassNames?: string;
   pageSize?: number;
   pager?: boolean;
   globalFilterFn?: FilterFn<any>;
   stickyFooter?: boolean;
}) {
   const FilterContext = useContext(TableFilterContext);

   const tableData = useMemo(
      () => [...(data?.listData?.docs ?? [])],
      [data?.listData?.docs],
   );

   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

   const [globalFilter, setGlobalFilter] = useState("");
   const [viewMode, setViewMode] = useState(
      defaultViewType ?? collection?.defaultViewType ?? "list",
   );
   const [sorting, setSorting] = useState<SortingState>(defaultSort ?? []);
   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
      columnViewability ?? {},
   );
   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: pageSize,
   });
   // Add grid view column to the beginning of the columns array if exists
   const updatedColumns =
      gridView && viewMode === "grid"
         ? [gridView, ...columns.slice(1)]
         : columns;

   const table = useReactTable({
      data: tableData,
      columns: updatedColumns,
      filterFns: {},
      state: {
         columnFilters: FilterContext?.globalColumnFilters ?? columnFilters,
         sorting,
         pagination,
         globalFilter: FilterContext?.globalSearchFilter ?? globalFilter,
         columnVisibility,
      },
      onColumnFiltersChange:
         FilterContext?.setGlobalColumnFilters ?? setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: setSorting,
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      onGlobalFilterChange:
         FilterContext?.setGlobalSearchFilter ?? setGlobalFilter,
      onColumnVisibilityChange: setColumnVisibility,
      globalFilterFn: globalFilterFn ?? fuzzyFilter,
   });

   return (
      <>
         {FilterContext?.globalColumnFilters &&
         typeof FilterContext?.setGlobalColumnFilters == "function" ? null : (
            <ListTop
               searchPlaceholder={searchPlaceholder}
               collection={collection}
               columnFilters={columnFilters}
               setColumnFilters={setColumnFilters}
               setGlobalFilter={setGlobalFilter}
               viewType={viewMode}
               filters={filters}
               setViewMode={setViewMode}
            />
         )}
         {viewMode === "list" ? (
            <ListView table={table} />
         ) : (
            <GridView
               table={table}
               gridCellClassNames={gridCellClassNames}
               gridContainerClassNames={gridContainerClassNames}
            />
         )}
         {tableData?.length > pageSize && pager ? (
            <ListPager table={table} stickyFooter={stickyFooter} />
         ) : null}
      </>
   );
}
