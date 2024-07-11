import { Suspense, useState, type ReactNode } from "react";

import { Await, useLoaderData, useLocation, useParams } from "@remix-run/react";
import { rankItem } from "@tanstack/match-sorter-utils";
import type {
   ColumnFiltersState,
   FilterFn,
   PaginationState,
   SortingState,
   VisibilityState,
} from "@tanstack/react-table";
import {
   useReactTable,
   getCoreRowModel,
   getFilteredRowModel,
   flexRender,
   getSortedRowModel,
   getPaginationRowModel,
} from "@tanstack/react-table";
import clsx from "clsx";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Loading } from "~/components/Loading";
import type { Collection } from "~/db/payload-types";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddEntry } from "./AddEntry";
import { CollectionHeader } from "./CollectionHeader";
import { ListFilters } from "./ListFilters";
import { AdPlaceholder, AdUnit } from "../../_components/RampUnit";

export type Section = {
   id: string;
   slug: string;
   name?: string;
   showTitle?: boolean;
   showAd?: boolean;
   viewType?: "tabs" | "rows";
   subSections?: [
      {
         id: string;
         showTitle?: boolean;
         slug: string;
         name: string;
         type: string;
      },
   ];
};

export type TableFilters = {
   id: string;
   label: string;
   cols?: 1 | 2 | 3 | 4 | 5;
   options: { label: string; value: string; icon?: string }[];
}[];

export function List({
   children,
   columns,
   columnViewability,
   filters,
   viewType,
}: {
   children?: ReactNode;
   columns?: any;
   columnViewability?: VisibilityState;
   filters?: TableFilters;
   viewType?: "list" | "grid";
}) {
   //@ts-ignore
   const { list } = useLoaderData();
   const { site } = useSiteLoaderData();
   //Get path for custom site, cant use useParams since it doesn't exist when using a custom template
   const { pathname } = useLocation();
   const collectionSlug = pathname.split("/")[2];
   const collectionId = useParams()?.collectionId ?? collectionSlug;
   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   ) as Collection;

   const [allSections, setAllSections] = useState(
      collection?.sections as Section[],
   );
   const [isChanged, setIsChanged] = useState(false);

   return (
      <>
         <CollectionHeader
            collection={collection}
            allSections={allSections}
            setAllSections={setAllSections}
            setIsChanged={setIsChanged}
            isChanged={isChanged}
         />
         <AdPlaceholder>
            <div
               className={`flex items-center justify-center ${
                  site.enableAds ? "min-h-[90px]" : ""
               }`}
            >
               <AdUnit
                  enableAds={site.enableAds}
                  adType="leaderboard_atf"
                  selectorId="listDesktopLeaderATF"
               />
            </div>
         </AdPlaceholder>
         <div className="mx-auto max-w-[728px] space-y-1 max-tablet:px-3 py-4 laptop:pb-14">
            {!collection?.customDatabase && <AddEntry />}
            {children ? (
               children
            ) : (
               <Suspense fallback={<Loading />}>
                  <Await resolve={list}>
                     {(list) => (
                        <Table
                           viewType={viewType}
                           key={collectionId}
                           data={list}
                           columns={columns}
                           collection={collection}
                           filters={filters}
                           columnViewability={columnViewability}
                        />
                     )}
                  </Await>
               </Suspense>
            )}
         </div>
      </>
   );
}

function Table({
   data,
   columns,
   collection,
   columnViewability,
   filters,
   viewType,
}: {
   data: any;
   columns: any;
   collection: Collection;
   columnViewability?: VisibilityState;
   filters?: TableFilters;
   viewType?: "list" | "grid";
}) {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [tabletData, _setData] = useState(() => [...data?.listData?.docs]);
   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
   const [globalFilter, setGlobalFilter] = useState("");

   const [columnVisibility, setColumnVisibility] =
      //@ts-ignore
      useState<VisibilityState>(columnViewability ?? {});

   const [sorting, setSorting] = useState<SortingState>([]);

   const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 100,
   });

   const table = useReactTable({
      data: tabletData,
      columns,
      filterFns: {},
      state: {
         columnFilters,
         sorting,
         pagination,
         globalFilter,
         columnVisibility,
      },
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(), //client-side sorting
      onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
      getFilteredRowModel: getFilteredRowModel(), //client side filtering
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      onGlobalFilterChange: setGlobalFilter,
      onColumnVisibilityChange: setColumnVisibility, // <-- To manipulate visibility state.
      globalFilterFn: fuzzyFilter,
      //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
   });

   return (
      <>
         <ListFilters
            collection={collection}
            filters={filters}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            setGlobalFilter={setGlobalFilter}
         />
         <div
            className="max-tablet:overflow-x-auto whitespace-nowrap scrollbar 
                  dark:scrollbar-thumb-zinc-500 dark:scrollbar-track-dark450
                  scrollbar-thumb-zinc-300 scrollbar-track-zinc-100 w-full"
         >
            <div className="table min-w-full relative">
               {/* Table Header */}
               <div className="table-header-group tablet:sticky top-[117px] laptop:top-[61px] bg-3">
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
                                       asc: (
                                          <Icon name="chevron-up" size={14} />
                                       ),
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
         {/* Pager */}
         <div className="flex items-center gap-2 justify-between pt-2">
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
      </>
   );
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
   // Rank the item
   const itemRank = rankItem(row.getValue(columnId), value);

   // Store the ranking info
   addMeta(itemRank);

   // Return if the item should be filtered in/out
   return itemRank.passed;
};
