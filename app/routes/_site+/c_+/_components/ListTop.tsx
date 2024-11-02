import type { Dispatch, SetStateAction } from "react";
import { useContext, useEffect, useState } from "react";

import type { ColumnFiltersState } from "@tanstack/react-table";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { useDebouncedValue } from "~/utils/use-debounce";

import type { TableFilters } from "./List";
import { MobileTray } from "../../_components/MobileTray";
import { TableFilterContext } from "./ListTableContainer";
import { Image } from "~/components/Image";

export function ListTop({
   collection,
   setGlobalFilter,
   columnFilters,
   setColumnFilters,
   viewType,
   searchPlaceholder,
   setViewMode,
   filters,
   hideViewMode = false,
}: {
   collection?: Collection;
   setGlobalFilter: Dispatch<SetStateAction<string>>;
   columnFilters: ColumnFiltersState;
   setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
   viewType?: "list" | "grid";
   searchPlaceholder?: string;
   setViewMode: Dispatch<SetStateAction<"list" | "grid">>;
   filters?: TableFilters;
   hideViewMode?: boolean;
}) {
   return (
      <div className="flex items-center justify-between w-full py-3 gap-3 sticky z-20 top-[61px] bg-3">
         {!hideViewMode && (
            <div
               className="overflow-hidden bg-3 dark:border-zinc-600 shadow-sm dark:shadow-zinc-800/80 rounded-md dark:divide-zinc-600
            border border-zinc-300/80 h-9 grid grid-cols-2 flex-none divide-x divide-zinc-300/80"
            >
               <button
                  onClick={() => setViewMode("list")}
                  className={clsx(
                     viewType == "list" &&
                        "bg-blue-50 dark:bg-gray-800 text-blue-500 dark:text-blue-500",
                     "px-3 text-1",
                  )}
               >
                  <Icon name="rows" size={15} />
               </button>
               <button
                  onClick={() => setViewMode("grid")}
                  className={clsx(
                     viewType == "grid" &&
                        "bg-blue-50 dark:bg-gray-800 text-blue-500 dark:text-blue-500",
                     "px-3 text-1",
                  )}
               >
                  <Icon name="layout-grid" size={15} />
               </button>
            </div>
         )}
         <TableSearchSection
            setGlobalFilter={setGlobalFilter}
            searchPlaceholder={searchPlaceholder}
            collection={collection}
         />
         <FilterSection
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            filters={filters}
            collection={collection}
         />
      </div>
   );
}

export function TableSearchSection({
   setGlobalFilter,
   searchPlaceholder,
   collection,
}: {
   setGlobalFilter?: Dispatch<SetStateAction<string>>;
   searchPlaceholder?: string | undefined;
   collection?: Collection;
}) {
   const [searchQuery, setSearchQuery] = useState("");
   const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

   const searchFilterContext = useContext(TableFilterContext);

   const setGlobalSearchFilter =
      typeof searchFilterContext?.setGlobalSearchFilter === "function"
         ? searchFilterContext?.setGlobalSearchFilter
         : setGlobalFilter;

   useEffect(() => {
      if (setGlobalSearchFilter) {
         if (debouncedSearchQuery) {
            setGlobalSearchFilter(String(debouncedSearchQuery));
         } else {
            setGlobalSearchFilter("");
         }
      }
   }, [debouncedSearchQuery]);

   return (
      <div
         className="relative flex items-center gap-2 w-full pl-2 pr-0.5 border bg-zinc-50 border-zinc-300
      dark:border-zinc-600/80 rounded-lg h-[37px] shadow-sm dark:shadow-zinc-800/80 dark:bg-dark450
      focus-within:dark:border-zinc-500"
      >
         <Icon name="search" size={14} />
         <input
            type="text"
            placeholder={`${
               searchPlaceholder
                  ? searchPlaceholder
                  : collection?.name
                    ? `Search ${collection?.name}...`
                    : "Search..."
            }`}
            className="border-0 bg-transparent focus:outline-none h-full w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
         />
         {searchQuery && (
            <button
               onClick={() => {
                  setSearchQuery("");
               }}
               className="size-7 flex items-center justify-center flex-none
                               rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
            >
               <Icon name="x" size={14} />
            </button>
         )}
      </div>
   );
}

export function FilterSection({
   filters,
   columnFilters,
   setColumnFilters,
   collection,
}: {
   filters: TableFilters | undefined;
   columnFilters?: ColumnFiltersState;
   setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
   collection?: Collection;
}) {
   const [filterMenuToggle, setFilterToggle] = useState(false);

   const tableFilters = useContext(TableFilterContext);

   const setCFilters =
      typeof tableFilters?.setGlobalColumnFilters === "function"
         ? tableFilters?.setGlobalColumnFilters
         : setColumnFilters;

   const cFilters = tableFilters?.globalColumnFilters
      ? tableFilters?.globalColumnFilters
      : columnFilters;

   return (
      filters && (
         <div className="flex items-center gap-3">
            <Button
               color="purple"
               onClick={() => setFilterToggle(!filterMenuToggle)}
               className="h-9 !font-bold"
            >
               Filter
               {cFilters && cFilters.length > 0 ? (
                  <span className="size-[15px] bg-white text-black text-[11px] rounded-full flex items-center justify-center">
                     {cFilters.length}
                  </span>
               ) : (
                  <Icon name="arrow-up-down" title="Sort" size={16} />
               )}
            </Button>
            <MobileTray
               direction="right"
               onOpenChange={setFilterToggle}
               open={filterMenuToggle}
            >
               <>
                  {cFilters && cFilters.length > 0 && (
                     <div className="max-laptop:pb-4 laptop:absolute laptop:top-3.5">
                        <Button
                           className="text-xs max-laptop:py-1.5 max-laptop:pl-2 !laptop:p-0 !laptop:size-7"
                           color="light/zinc"
                           onClick={() =>
                              setCFilters &&
                              setCFilters([] as ColumnFiltersState)
                           }
                        >
                           <Icon
                              title="Clear Filters"
                              name="refresh-ccw"
                              size={12}
                           />
                           <span className="laptop:hidden">Refresh</span>
                        </Button>
                     </div>
                  )}
                  <div className="space-y-6">
                     {filters.map((filterRow) => {
                        return (
                           <section key={filterRow.id}>
                              <div className="pb-2 pl-0.5 font-bold text-sm text-1">
                                 {filterRow.label}
                              </div>
                              <div
                                 key={filterRow.id}
                                 className={clsx(
                                    filterRow.cols === 1 && "grid-cols-1",
                                    filterRow.cols === 2 && "grid-cols-2",
                                    filterRow.cols === 3 && "grid-cols-3",
                                    filterRow.cols === 4 && "grid-cols-4",
                                    filterRow.cols === 5 && "grid-cols-5",
                                    "grid gap-2",
                                 )}
                              >
                                 {filterRow.options.map((option) => {
                                    return (
                                       <button
                                          className={clsx(
                                             "text-left rounded-lg px-2 py-1.5 text-sm w-full border shadow-sm shadow-1",
                                             cFilters &&
                                                cFilters.some(
                                                   (filter) =>
                                                      filter.id ===
                                                         filterRow.id &&
                                                      //@ts-ignore
                                                      filter.value.includes(
                                                         option.value,
                                                      ),
                                                )
                                                ? "dark:bg-dark500 bg-zinc-200/80 border-zinc-400/60 dark:border-zinc-500"
                                                : "dark:bg-dark400 dark:hover:bg-dark450 bg-zinc-50 dark:hover:border-zinc-600  border-color dark:border-zinc-700 hover:bg-zinc-100 hover:border-zinc-300",
                                          )}
                                          key={option.label}
                                          onClick={() => {
                                             setCFilters &&
                                                setCFilters((prevFilters) => {
                                                   const existingFilter =
                                                      prevFilters.find(
                                                         (filter) =>
                                                            filter.id ===
                                                            filterRow.id,
                                                      );

                                                   if (existingFilter) {
                                                      const updatedValue =
                                                         //@ts-ignore
                                                         existingFilter.value.includes(
                                                            option.value,
                                                         )
                                                            ? //@ts-ignore
                                                              existingFilter.value.filter(
                                                                 (value: any) =>
                                                                    value !==
                                                                    option.value,
                                                              )
                                                            : [
                                                                 //@ts-ignore
                                                                 ...existingFilter.value,
                                                                 option.value,
                                                              ];
                                                      if (
                                                         updatedValue.length ===
                                                         filterRow.options
                                                            .length
                                                      ) {
                                                         // Reset the filter if all options are selected
                                                         return prevFilters.filter(
                                                            (filter) =>
                                                               filter.id !==
                                                               filterRow.id,
                                                         );
                                                      }
                                                      if (
                                                         updatedValue.length ===
                                                         0
                                                      ) {
                                                         // Remove the entire object from the column filters array
                                                         return prevFilters.filter(
                                                            (filter) =>
                                                               filter.id !==
                                                               filterRow.id,
                                                         );
                                                      }
                                                      return prevFilters.map(
                                                         (filter) =>
                                                            filter.id ===
                                                            filterRow.id
                                                               ? {
                                                                    ...filter,
                                                                    value: updatedValue,
                                                                 }
                                                               : filter,
                                                      );
                                                   } else {
                                                      return [
                                                         ...prevFilters,
                                                         {
                                                            id: filterRow.id,
                                                            value: [
                                                               option.value,
                                                            ],
                                                         },
                                                      ];
                                                   }
                                                });
                                          }}
                                       >
                                          <div className="flex items-center gap-2">
                                             {option?.icon && !option?.label ? (
                                                <Image
                                                   className="h-5"
                                                   url={option?.icon}
                                                />
                                             ) : option?.icon ? (
                                                <>
                                                   <Avatar
                                                      square
                                                      className="size-5"
                                                      options="height=40&width=40"
                                                      src={option?.icon}
                                                   />
                                                   {option?.label}
                                                </>
                                             ) : (
                                                option?.label
                                             )}
                                          </div>
                                       </button>
                                    );
                                 })}
                              </div>
                           </section>
                        );
                     })}
                  </div>
               </>
            </MobileTray>
            {collection?.customDatabase && (
               <AdminOrStaffOrOwner>
                  <Button
                     type="button"
                     color="dark/white"
                     target="_blank"
                     className="text-sm flex-none h-9"
                     href={`/admin/collections/${collection?.slug}/create`}
                     onMouseOver={(e: any) => {
                        e.target.port = 4000;
                     }}
                  >
                     <Icon className="" name="plus" size={15} />
                     Add
                  </Button>
               </AdminOrStaffOrOwner>
            )}
         </div>
      )
   );
}
