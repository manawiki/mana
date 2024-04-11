import { Link, useSearchParams } from "@remix-run/react";
import clsx from "clsx";
import type { PaginatedDocs } from "payload/database";

import type { Entry } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";

export function CollectionListRows({
   entries,
   CellComponent,
   cellContainerClass,
}: {
   entries: PaginatedDocs<Entry>;
   CellComponent?: any;
   cellContainerClass?: string;
}) {
   //Paging Variables
   const [, setSearchParams] = useSearchParams({});

   const currentEntry = entries?.pagingCounter;
   const totalEntries = entries?.totalDocs;
   const totalPages = entries?.totalPages;
   const limit = entries?.limit;
   const hasNextPage = entries?.hasNextPage;
   const hasPrevPage = entries?.hasPrevPage;

   return (
      <>
         {entries?.docs?.length > 0 ? (
            <div
               className={clsx(
                  CellComponent && cellContainerClass
                     ? cellContainerClass
                     : "border-color-sub divide-color-sub divide-y overflow-hidden shadow shadow-zinc-100 dark:shadow-zinc-800/80 rounded-xl border",
               )}
            >
               {entries.docs?.map((entry: Entry, int: number) =>
                  CellComponent ? (
                     <CellComponent key={entry.id} entry={entry} />
                  ) : (
                     <Link
                        key={entry.id}
                        to={entry.slug ?? entry.id}
                        // prefetch="intent" Enabling this makes hover perform weird
                        className="flex items-center gap-3 p-2 dark:odd:bg-dark350 odd:bg-zinc-50 group"
                     >
                        <div
                           className="border-color-sub shadow-1 flex h-8 w-8 items-center justify-between
                                 overflow-hidden rounded-full border bg-3-sub shadow-sm"
                        >
                           {entry.icon?.url ? (
                              <Image /* @ts-ignore */
                                 url={entry.icon?.url}
                                 options="aspect_ratio=1:1&height=80&width=80"
                                 alt={entry.name ?? "Entry Icon"}
                                 loading={int > 10 ? "lazy" : undefined}
                              />
                           ) : (
                              <Icon
                                 name="component"
                                 className="text-1 mx-auto"
                                 size={18}
                              />
                           )}
                        </div>
                        <span className="text-sm font-bold group-hover:underline">
                           {entry.name}
                        </span>
                     </Link>
                  ),
               )}
            </div>
         ) : (
            <div className="text-sm text-1 border-t text-center border-color py-3 mt-4">
               No entries exist...
            </div>
         )}
         {/* Pagination Section */}
         {totalPages > 1 && (
            <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
               <div>
                  Showing <span className="font-bold">{currentEntry}</span> to{" "}
                  <span className="font-bold">
                     {limit + currentEntry - 1 > totalEntries
                        ? totalEntries
                        : limit + currentEntry - 1}
                  </span>{" "}
                  of <span className="font-bold">{totalEntries}</span> results
               </div>
               <div className="flex items-center gap-3 text-xs">
                  {hasPrevPage ? (
                     <button
                        className="flex items-center gap-1 font-semibold uppercase hover:underline"
                        onClick={() =>
                           setSearchParams((searchParams) => {
                              searchParams.set("page", entries.prevPage as any);
                              return searchParams;
                           })
                        }
                     >
                        <Icon
                           name="chevron-left"
                           size={18}
                           className="text-zinc-500"
                        >
                           Prev
                        </Icon>
                     </button>
                  ) : null}
                  {hasNextPage && hasPrevPage && (
                     <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  )}
                  {hasNextPage ? (
                     <button
                        className="flex items-center gap-1 font-semibold uppercase hover:underline"
                        onClick={() =>
                           setSearchParams((searchParams) => {
                              searchParams.set("page", entries.nextPage as any);
                              return searchParams;
                           })
                        }
                     >
                        Next
                        <Icon
                           name="chevron-right"
                           title="Next"
                           size={18}
                           className="text-zinc-500"
                        />
                     </button>
                  ) : null}
               </div>
            </div>
         )}
      </>
   );
}
