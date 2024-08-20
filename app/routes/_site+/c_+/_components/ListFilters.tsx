import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

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

export function ListFilters({
   collection,
   setGlobalFilter,
   filters,
   columnFilters,
   setColumnFilters,
   viewType,
   searchPlaceholder,
   setViewMode,
}: {
   collection: Collection;
   setGlobalFilter: any;
   columnFilters: ColumnFiltersState;
   setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
   filters?: TableFilters;
   viewType?: "list" | "grid";
   searchPlaceholder?: string;
   setViewMode: Dispatch<SetStateAction<"list" | "grid">>;
}) {
   const [filterMenuToggle, setFilterToggle] = useState(false);

   const [searchQuery, setSearchQuery] = useState("");
   const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

   useEffect(() => {
      if (debouncedSearchQuery) {
         setGlobalFilter(String(debouncedSearchQuery));
      } else {
         setGlobalFilter("");
      }
   }, [debouncedSearchQuery]);

   return (
      <div
         className={clsx(
            viewType == "list" && "top-32 laptop:top-[104px]",
            viewType == "grid" && "top-32 laptop:top-20",
            "flex items-center justify-between w-full pb-2 gap-3 sticky  z-20",
         )}
      >
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
         {filters && (
            <div className="flex items-center gap-3">
               <Button
                  onClick={() => setFilterToggle(!filterMenuToggle)}
                  className="text-sm h-9 font-bold"
               >
                  Filter
                  {columnFilters.length > 0 ? (
                     <span className="size-[15px] bg-white text-black text-[11px] rounded-full flex items-center justify-center">
                        {columnFilters.length}
                     </span>
                  ) : (
                     <Icon name="arrow-up-down" title="Sort" size={12} />
                  )}
               </Button>
               <MobileTray
                  direction="right"
                  onOpenChange={setFilterToggle}
                  open={filterMenuToggle}
               >
                  <>
                     {columnFilters.length > 0 && (
                        <div className="max-laptop:pb-4 laptop:absolute laptop:top-3.5">
                           <Button
                              className="text-xs max-laptop:py-1.5 max-laptop:pl-2 !laptop:p-0 !laptop:size-7"
                              color="light/zinc"
                              onClick={() => setColumnFilters([])}
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
                                                "text-left rounded-lg px-2 py-1.5 text-sm w-full border border-color dark:border-zinc-700 shadow-sm shadow-1",
                                                columnFilters.some(
                                                   (filter) =>
                                                      filter.id ===
                                                         filterRow.id &&
                                                      //@ts-ignore
                                                      filter.value.includes(
                                                         option.value,
                                                      ),
                                                )
                                                   ? "dark:bg-dark500 bg-zinc-200/80 border-zinc-400/60 dark:border-zinc-400/40"
                                                   : "dark:bg-dark400 dark:hover:bg-dark450 bg-zinc-50 dark:hover:border-zinc-600 hover:bg-zinc-100 hover:border-zinc-300",
                                             )}
                                             key={option.label}
                                             onClick={() => {
                                                setColumnFilters(
                                                   (prevFilters) => {
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
                                                                    (
                                                                       value: any,
                                                                    ) =>
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
                                                   },
                                                );
                                             }}
                                          >
                                             <div className="flex items-center gap-2">
                                                {option?.icon && (
                                                   <Avatar
                                                      className="size-5"
                                                      options="height=20&width=20"
                                                      src={option?.icon}
                                                   />
                                                )}
                                                <span>{option.label}</span>
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
                        color="blue"
                        target="_blank"
                        className="text-sm flex-none h-9"
                        href={`/admin/collections/${collection?.slug}/create`}
                        onMouseOver={(e: any) => {
                           e.target.port = 4000;
                        }}
                     >
                        <Icon className="text-blue-200" name="plus" size={15} />
                        Add
                     </Button>
                  </AdminOrStaffOrOwner>
               )}
            </div>
         )}
      </div>
   );
}
