import { useState } from "react";

import { Listbox, Transition } from "@headlessui/react";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import dt from "date-and-time";

import { Tooltip, TooltipContent, TooltipTrigger } from "~/components";
import { Icon } from "~/components/Icon";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

import { PostListPagination } from "./PostListPagination";
import type { loader } from "../_posts";

export function MyPosts() {
   const { myPosts, siteId } = useLoaderData<typeof loader>();
   const [selectedStatus, setSelectedStatus] = useState("All");

   const [, setSearchParams] = useSearchParams({});

   return (
      <AdminOrStaffOrOwner>
         <section className="pt-3 pb-6">
            <div className="flex items-center justify-between pb-2">
               <div className="text-1 text-sm font-bold">Last Edited</div>
               <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                  <div className="relative z-10">
                     <Listbox.Button className="text-1 flex items-center gap-2 text-sm font-semibold hover:underline">
                        {selectedStatus}
                        <Icon
                           name="chevrons-up-down"
                           className="text-zinc-500"
                           size={16}
                        />
                     </Listbox.Button>
                     <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                     >
                        <Listbox.Options
                           className="border-color text-1 bg-3 shadow-1 absolute right-0
                                 mt-2 w-[120px] rounded-lg border p-1.5 shadow-lg"
                        >
                           <Listbox.Option key="draft" value="Drafts">
                              {({ selected }) => (
                                 <>
                                    <button
                                       className="text-1 relative flex w-full items-center gap-3 rounded-md
                                              px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() =>
                                          setSearchParams((searchParams) => {
                                             searchParams.set(
                                                "status",
                                                "draft",
                                             );
                                             return searchParams;
                                          })
                                       }
                                    >
                                       {selected ? (
                                          <span
                                             className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                          />
                                       ) : null}
                                       Draft
                                    </button>
                                 </>
                              )}
                           </Listbox.Option>
                           <Listbox.Option key="published" value="Published">
                              {({ selected }) => (
                                 <>
                                    <button
                                       className="text-1 relative flex w-full items-center gap-3 rounded-md
                                           px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() =>
                                          setSearchParams((searchParams) => {
                                             searchParams.set(
                                                "status",
                                                "published",
                                             );
                                             return searchParams;
                                          })
                                       }
                                    >
                                       {selected ? (
                                          <span
                                             className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                          />
                                       ) : null}
                                       Published
                                    </button>
                                 </>
                              )}
                           </Listbox.Option>
                           <Listbox.Option key="all" value="All">
                              {({ selected }) => (
                                 <>
                                    <button
                                       className="text-1 relative flex w-full items-center gap-3 rounded-md
                                           px-2 py-1 text-sm hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                       onClick={() =>
                                          setSearchParams((searchParams) => {
                                             searchParams.delete("status");
                                             return searchParams;
                                          })
                                       }
                                    >
                                       {selected ? (
                                          <span
                                             className="absolute right-2 h-1.5 w-1.5 rounded-full
                                                 bg-zinc-500"
                                          />
                                       ) : null}
                                       All
                                    </button>
                                 </>
                              )}
                           </Listbox.Option>
                        </Listbox.Options>
                     </Transition>
                  </div>
               </Listbox>
            </div>
            <section className="border-color divide-color divide-y border-y">
               {myPosts && myPosts?.docs.length === 0 ? (
                  <div className="py-3 text-sm ">No drafts...</div>
               ) : (
                  myPosts?.docs?.map((post) => (
                     <Link
                        to={`/${siteId}/p/${post.slug}`}
                        key={post.id}
                        className="group flex items-center justify-between gap-2 py-3"
                     >
                        <span className="truncate text-sm font-bold group-hover:underline">
                           {post.name}
                        </span>
                        {post.updatedAt && (
                           <div className="flex flex-none items-center gap-4">
                              <time
                                 className="text-1 flex items-center gap-1.5 text-xs"
                                 dateTime={post?.updatedAt}
                              >
                                 {dt.format(new Date(post?.updatedAt), "MMM D")}
                              </time>
                              {post.publishedAt &&
                                 post.content?._status == "draft" && (
                                    <Tooltip>
                                       <TooltipTrigger>
                                          <Icon
                                             name="pencil"
                                             size={12}
                                             className="text-zinc-400"
                                          />
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          Unpublished changes...
                                       </TooltipContent>
                                    </Tooltip>
                                 )}
                              {post.publishedAt ? (
                                 <Tooltip>
                                    <TooltipTrigger>
                                       <div className="h-2 w-2 rounded-full bg-green-300 dark:bg-green-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>Published</TooltipContent>
                                 </Tooltip>
                              ) : (
                                 <Tooltip>
                                    <TooltipTrigger>
                                       <div className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>Draft</TooltipContent>
                                 </Tooltip>
                              )}
                           </div>
                        )}
                     </Link>
                  ))
               )}
            </section>
            <PostListPagination
               myPosts={myPosts}
               setSearchParams={setSearchParams}
            />
         </section>
      </AdminOrStaffOrOwner>
   );
}
