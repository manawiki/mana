import { useState } from "react";

import { useNavigate, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import qs from "qs";

import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { Collection } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";

import { MobileTray } from "../../_components/MobileTray";

export function CustomDBFilters({ collection }: { collection: Collection }) {
   const navigate = useNavigate();

   const [filterMenuToggle, setFilterToggle] = useState(false);

   const [searchParams] = useSearchParams();

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
      const updatedPath = qs.stringify(
         {
            ...(filterQuery?.where
               ? { ...filterQuery, ...newFilter }
               : newFilter),
         },
         { addQueryPrefix: true },
      );
      return navigate(updatedPath, {
         replace: true,
         preventScrollReset: true,
      });
   }

   return (
      <div className="flex items-center justify-between w-full pb-2">
         <div className="flex items-center gap-3">
            <Button
               onClick={() => setFilterToggle(!filterMenuToggle)}
               href={`/c/${collection.slug}?sort=name`}
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
                  {collection.filterGroups?.map((filter) => (
                     <div key={filter.filterKey}>
                        <div className="pb-2">{filter.label}</div>
                        <div className="grid grid-cols-2 gap-3">
                           {filter?.filterItem?.map((filterItem) => {
                              const isActiveFilter =
                                 //@ts-ignore
                                 filterQuery?.where?.or?.[0]?.and?.[0]?.[
                                    filter?.filterKey
                                 ]?.[`[${filter?.queryOperator}]`] ===
                                 filterItem.value;
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
