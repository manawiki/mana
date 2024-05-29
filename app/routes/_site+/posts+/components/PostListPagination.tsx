import type { SerializeFrom } from "@remix-run/node";
import type { useSearchParams } from "@remix-run/react";

import { Icon } from "~/components/Icon";

import type { loader } from "../_posts";

type setSearchParamsType = ReturnType<typeof useSearchParams>[1];

export function PostListPagination({
   myPosts,
   setSearchParams,
}: {
   myPosts: SerializeFrom<typeof loader>["myPosts"];
   setSearchParams: setSearchParamsType;
}) {
   if (myPosts && myPosts?.totalPages > 1)
      return (
         <div className="text-1 flex items-center justify-between pt-3 pb-5 text-sm">
            <div>
               Showing{" "}
               <span className="font-bold">{myPosts?.pagingCounter}</span> to{" "}
               <span className="font-bold">
                  {myPosts?.docs?.length + myPosts.pagingCounter - 1}
               </span>{" "}
               of <span className="font-bold">{myPosts?.totalDocs}</span>{" "}
               results
            </div>
            <div className="flex items-center gap-3 text-xs">
               {myPosts?.hasPrevPage ? (
                  <button
                     className="flex items-center gap-1 font-semibold uppercase hover:underline"
                     onClick={() =>
                        setSearchParams((searchParams) => {
                           searchParams.set("page", myPosts.prevPage as any);
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
               {myPosts.hasNextPage && myPosts.hasPrevPage && (
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
               )}
               {myPosts.hasNextPage ? (
                  <button
                     className="flex items-center gap-1 font-semibold uppercase hover:underline"
                     onClick={() =>
                        setSearchParams((searchParams) => {
                           searchParams.set("page", myPosts.nextPage as any);
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
      );
}
