import { useState } from "react";

import { useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import qs from "qs";

import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

import { MobileTray } from "../../_components/MobileTray";

export function CustomDBFilters({ collection }: { collection: Collection }) {
   const [filterMenuToggle, setFilterToggle] = useState(false);

   const [searchParams, setSearchParams] = useSearchParams();

   const filterQuery = searchParams
      ? qs.parse(searchParams.toString())
      : undefined;

   function queryParse(filter: any, filterItem: any) {
      const newFilter = {
         where: {
            or: [
               {
                  and: [
                     {
                        [filter?.filterKey]: {
                           [filter?.queryOperator]: filterItem.value,
                        },
                     },
                  ],
               },
            ],
         },
      };
      const updatedPath = qs.stringify({
         ...(filterQuery?.where ? { ...filterQuery, ...newFilter } : newFilter),
      });

      const params = new URLSearchParams();

      params.set("where", updatedPath);

      return setSearchParams(params, { preventScrollReset: true });
   }
   return (
      <div className="flex items-center justify-between w-full pb-2">
         <div className="flex items-center gap-3">
            <Button
               onClick={() => setFilterToggle(!filterMenuToggle)}
               className="text-sm"
            >
               Filter
               <Icon name="arrow-up-down" title="Sort" size={14} />
            </Button>
            <MobileTray
               shouldScaleBackground
               direction="right"
               onOpenChange={setFilterToggle}
               open={filterMenuToggle}
            >
               <div className="space-y-6">
                  <div>
                     <div className="pb-2 text-sm font-bold text-1">
                        Sort by
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        {collection.sortGroups?.map((sortItem) => {
                           const isActiveSort =
                              filterQuery?.sort === sortItem.value ||
                              filterQuery?.sort === `-${sortItem.value}`;
                           return (
                              <Button
                                 plain
                                 className={clsx(
                                    isActiveSort
                                       ? "bg-zinc-200/80 dark:bg-dark450 border-zinc-400 dark:border-zinc-500/80 shadow-sm"
                                       : "bg-zinc-100 dark:bg-dark400",
                                    "rounded-lg p-2 text-sm border border-transparent flex items-center !text-left !justify-start gap-2",
                                 )}
                                 key={sortItem.value}
                                 onClick={() => {
                                    setSearchParams((prev) => {
                                       prev.set(
                                          "sort",
                                          sortItem.defaultSortType &&
                                             !prev.get("sort")
                                             ? sortItem.value.charAt(0) == "-"
                                                ? sortItem.value
                                                : `-${sortItem.value}`
                                             : prev.get("sort") &&
                                                 prev.get("sort") ==
                                                    `-${sortItem.value}`
                                               ? `${sortItem.value}`
                                               : `-${sortItem.value}`,
                                       );

                                       return prev;
                                    });
                                 }}
                              >
                                 <span className="flex-grow">
                                    {sortItem.label}
                                 </span>
                                 {isActiveSort && (
                                    <div className="flex-none">
                                       {searchParams.get("sort")?.charAt(0) ==
                                       "-" ? (
                                          <Icon name="arrow-down" size={14} />
                                       ) : (
                                          <Icon name="arrow-up" size={14} />
                                       )}
                                    </div>
                                 )}
                              </Button>
                           );
                        })}
                     </div>
                  </div>
                  {collection.filterGroups?.map((filter) => (
                     <div key={filter.filterKey}>
                        <div className="pb-2 text-sm font-bold text-1">
                           {filter.label}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {filter?.filterItem?.map((filterItem) => {
                              const isActiveFilter =
                                 //@ts-ignore
                                 qs.parse(filterQuery?.where)?.where?.or?.[0]
                                    ?.and?.[0]?.[filter?.filterKey]?.[
                                    `[${filter?.queryOperator}]`
                                 ] === filterItem.value;
                              return (
                                 <>
                                    <Button
                                       plain
                                       className={clsx(
                                          isActiveFilter
                                             ? "bg-zinc-200/80 dark:bg-dark450 border-zinc-400 dark:border-zinc-500/80 shadow-sm"
                                             : "bg-zinc-100 dark:bg-dark400",
                                          "rounded-lg p-2 text-sm border border-transparent flex items-center !justify-start gap-2",
                                       )}
                                       key={filter.id}
                                       onClick={() =>
                                          queryParse(filter, filterItem)
                                       }
                                    >
                                       {filterItem.icon && (
                                          <Avatar
                                             src={filterItem.icon}
                                             className="size-5 flex-none"
                                          />
                                       )}
                                       {filterItem.name}
                                    </Button>
                                 </>
                              );
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </MobileTray>
         </div>
         <AdminOrStaffOrOwner>
            <Button
               type="button"
               color="blue"
               target="_blank"
               className="text-sm"
               href={`http://localhost:4000/admin/collections/${collection?.slug}/create`}
            >
               <Icon className="text-blue-200" name="plus" size={15} />
               Add {collection?.name}
            </Button>
         </AdminOrStaffOrOwner>
      </div>
   );
}
