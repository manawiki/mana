import { useEffect, useState } from "react";

import { RadioGroup } from "@headlessui/react";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import clsx from "clsx";

import { Avatar } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Site } from "~/db/payload-types";
import { useDebouncedValue } from "~/utils/use-debounce";

import type { loader } from "../_index";

export function Discover() {
   const { q, sites } = useLoaderData<typeof loader>() || {};

   const [query, setQuery] = useState(q);
   const debouncedValue = useDebouncedValue(query, 500);
   const [searchParams, setSearchParams] = useSearchParams({});
   const [category, setCategory] = useState("all");

   useEffect(() => {
      if (debouncedValue) {
         setSearchParams((searchParams) => {
            searchParams.set("q", debouncedValue);
            return searchParams;
         });
      } else {
         setSearchParams((searchParams) => {
            searchParams.delete("q");
            return searchParams;
         });
      }
   }, [debouncedValue, setSearchParams]);

   return (
      <>
         <section className="relative z-10 h-full flex-grow">
            <div className="border-zinc-300/80 dark:border-zinc-600/50 border-t-2 px-4 py-20 relative">
               <div className="relative z-20">
                  <main className="mx-auto max-w-2xl">
                     <div className="pb-7 font-header text-2xl text-center">
                        Find your wiki
                     </div>
                     <div className="flex items-center justify-center">
                        <div
                           className="bg-white dark:shadow-zinc-800/50 dark:border-zinc-600/50 relative dark:bg-dark350
                         h-12 w-full rounded-xl border-2 border-zinc-300/80 drop-shadow-sm dark:focus-within:border-zinc-600
                        focus-within:border-zinc-300"
                        >
                           <>
                              <div className="relative flex h-full w-full items-center gap-4 px-3">
                                 <Icon name="search" size={18} />
                                 <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-full w-full rounded-2xl border-0 bg-transparent 
                                 focus:outline-none focus:ring-0"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                 />
                                 {searchParams.size >= 1 && (
                                    <button
                                       onClick={() => {
                                          setSearchParams((searchParams) => {
                                             searchParams.delete("q");
                                             searchParams.delete("c");
                                             setCategory("all");
                                             return searchParams;
                                          });
                                          setQuery("");
                                       }}
                                       className="size-7 flex items-center justify-center flex-none
                                     rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                                    >
                                       <Icon name="x" size={14} />
                                    </button>
                                 )}
                              </div>
                           </>
                        </div>
                     </div>
                     <div className="flex items-center justify-between gap-4 py-3">
                        <RadioGroup
                           className="flex items-center gap-3"
                           value={category}
                           onChange={(value) => {
                              if (value != "all") {
                                 setSearchParams(
                                    (searchParams) => {
                                       searchParams.set("c", value);
                                       return searchParams;
                                    },
                                    { preventScrollReset: false },
                                 );
                              } else
                                 setSearchParams(
                                    (searchParams) => {
                                       searchParams.delete("c");
                                       return searchParams;
                                    },
                                    { preventScrollReset: false },
                                 );
                              setCategory(value);
                           }}
                        >
                           <RadioGroup.Option value="all">
                              {({ checked }) => (
                                 <div
                                    className={clsx(
                                       checked
                                          ? "!border-transparent bg-zinc-700 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-800"
                                          : "dark:bg-zinc-700 dark:border-zinc-600 bg-white ",
                                       "dark:shadow-zinc-900/40 shadow-zinc-200 flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow-sm",
                                    )}
                                 >
                                    <Icon
                                       name="globe-2"
                                       className="h-3.5 w-3.5"
                                    >
                                       All
                                    </Icon>
                                 </div>
                              )}
                           </RadioGroup.Option>
                           <RadioGroup.Option value="gaming">
                              {({ checked }) => (
                                 <div
                                    className={clsx(
                                       checked
                                          ? "!border-transparent bg-zinc-700 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-800"
                                          : "dark:bg-zinc-700 dark:border-zinc-600 bg-white ",
                                       "dark:shadow-zinc-900/40 shadow-zinc-200 flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow-sm",
                                    )}
                                 >
                                    {/* <Gamepad2 size={16} /> */}
                                    <Icon name="gamepad-2" className="h-4 w-4">
                                       Gaming
                                    </Icon>
                                 </div>
                              )}
                           </RadioGroup.Option>
                           <RadioGroup.Option value="other">
                              {({ checked }) => (
                                 <div
                                    className={clsx(
                                       checked
                                          ? "!border-transparent bg-zinc-700 text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-800"
                                          : "dark:bg-zinc-700 dark:border-zinc-600 bg-white ",
                                       "dark:shadow-zinc-900/40 shadow-zinc-200 flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-xs font-bold uppercase shadow-sm",
                                    )}
                                 >
                                    <Icon
                                       name="component"
                                       className="h-3.5 w-3.5"
                                    >
                                       Other
                                    </Icon>
                                 </div>
                              )}
                           </RadioGroup.Option>
                        </RadioGroup>
                     </div>
                  </main>
                  <div className="relative z-20 grid mobile:grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-3 gap-4 mx-auto max-w-5xl">
                     {sites?.docs.length === 0 ? (
                        <div className="py-3 text-sm "></div>
                     ) : (
                        sites?.docs.map((site: Site) => (
                           <Link
                              to={
                                 site.domain
                                    ? `https://${site.domain}`
                                    : `https://${site.slug}.mana.wiki`
                              }
                              key={site.id}
                              className="group bg-zinc-50 dark:shadow-zinc-900/50  border-zinc-200/80 hover:border-zinc-300
                              gap-3.5 rounded-2xl border p-2.5 shadow-sm dark:hover:border-zinc-600 dark:bg-dark350 dark:border-zinc-700"
                           >
                              <Image
                                 url={site?.banner?.url}
                                 options="aspect_ratio=1.9:1&height=800"
                                 className="rounded-lg overflow-hidden shadow-sm shadow-1"
                              />
                              <div className="-mt-9 space-y-1 p-2 flex flex-col ">
                                 <Avatar
                                    src={site.icon?.url}
                                    initials={site?.name?.charAt(0)}
                                    className="size-14 flex-none border-4 border-zinc-50 dark:border-dark350 relative z-10 ml-0.5"
                                    options="aspect_ratio=1:1&height=140&width=140"
                                 />
                                 <div
                                    className="font-header group-hover:underline underline-offset-2 decoration-zinc-400 dark:decoration-zinc-500
                                     font-bold relative flex items-center gap-1.5 z-20"
                                 >
                                    <Tooltip placement="top">
                                       <TooltipTrigger>
                                          <Icon
                                             name="badge-check"
                                             size={16}
                                             className="text-teal-500"
                                          />
                                       </TooltipTrigger>
                                       <TooltipContent>Verified</TooltipContent>
                                    </Tooltip>
                                    <span className="truncate">
                                       {site.name}
                                    </span>
                                 </div>
                                 <div className="text-xs text-1 line-clamp-1">
                                    {site.about}
                                 </div>
                                 <div className="flex items-center justify-between pt-1">
                                    {site?.followers && (
                                       <div className="text-[10px] flex items-center gap-1">
                                          <Icon
                                             name="users-2"
                                             size={12}
                                             className="text-1"
                                          />
                                          <span className="dark:text-zinc-500 text-zinc-400">
                                             {site?.followers}
                                          </span>
                                       </div>
                                    )}
                                    <span className="text-xs dark:text-zinc-500 text-zinc-400 flex items-center gap-1">
                                       <Icon
                                          name="link-2"
                                          size={12}
                                          className="text-1"
                                       />
                                       {site.domain
                                          ? site.domain
                                          : `${site.slug}.mana.wiki`}
                                    </span>
                                 </div>
                              </div>
                           </Link>
                        ))
                     )}
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-4 pb-10 relative z-10 max-w-3xl mx-auto">
                     {sites?.totalPages > 0 && (
                        <div className="text-1 flex items-center justify-between py-3 pl-1 text-xs">
                           <div>
                              Showing{" "}
                              <span className="font-bold">
                                 {sites?.pagingCounter}
                              </span>{" "}
                              to{" "}
                              <span className="font-bold">
                                 {sites?.docs?.length + sites.pagingCounter - 1}
                              </span>{" "}
                              of{" "}
                              <span className="font-bold">
                                 {sites?.totalDocs}
                              </span>{" "}
                              results
                           </div>
                           <div className="flex items-center gap-3 text-xs">
                              {sites?.hasPrevPage ? (
                                 <button
                                    className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                    onClick={() =>
                                       setSearchParams((searchParams) => {
                                          searchParams.set(
                                             "page",
                                             sites.prevPage as any,
                                          );
                                          return searchParams;
                                       })
                                    }
                                 >
                                    <Icon
                                       name="chevron-left"
                                       className="text-zinc-500 w-4.5 h-4.5"
                                    />
                                    Prev
                                 </button>
                              ) : null}
                              {sites.hasNextPage && sites.hasPrevPage && (
                                 <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                              )}
                              {sites.hasNextPage ? (
                                 <button
                                    className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                    onClick={() =>
                                       setSearchParams((searchParams) => {
                                          searchParams.set(
                                             "page",
                                             sites.nextPage as any,
                                          );
                                          return searchParams;
                                       })
                                    }
                                 >
                                    Next
                                    <Icon
                                       name="chevron-right"
                                       className="text-zinc-500 w-4.5 h-4.5"
                                    />
                                 </button>
                              ) : null}
                           </div>
                        </div>
                     )}
                     <div className="border-t flex-grow border-color-sub" />
                     <Link
                        className="text-xs text-1 hover:underline group flex items-center gap-1"
                        to="https://hq.mana.wiki/p/how-to-verify-your-site"
                     >
                        How to
                        <Tooltip placement="top">
                           <TooltipTrigger>
                              <Icon
                                 className="dark:text-dark text-light group-hover:text-teal-500"
                                 name="badge-check"
                                 size={14}
                              />
                           </TooltipTrigger>
                           <TooltipContent>Verified</TooltipContent>
                        </Tooltip>
                        verify your wiki?
                     </Link>
                  </div>
               </div>
            </div>
            <div
               className="pattern-dots absolute left-0
                  top-0 h-full  w-full
                  pb-6 pattern-bg-white pattern-zinc-400 pattern-opacity-10 pattern-size-4 
                  dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
         </section>
      </>
   );
}
