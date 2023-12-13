import { Link } from "@remix-run/react";

import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { Site } from "~/db/payload-types";
import { LoggedOut } from "~/routes/_auth+/src/components";
import { AdUnit } from "~/routes/_site+/$siteId+/src/components/Ramp";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export function ColumnFour({ site }: { site: Site }) {
   return (
      <section className="relative z-40 laptop:block max-laptop:bg-2-sub">
         <div
            className="flex flex-col laptop:fixed laptop:border-l laptop:shadow-sm laptop:shadow-1 h-full bg-2-sub laptop:bg-2 max-laptop:max-w-[728px]
            laptop:w-[334px] border-color laptop:overflow-y-auto max-laptop:mx-auto"
         >
            <div className="laptop:h-full flex flex-col">
               {/* Mobile */}
               <section className="border-color py-4 max-tablet:border-b max-tablet:px-3 laptop:hidden">
                  <PrimaryMenuLinks site={site} />
                  <PinnedList site={site} />
               </section>
               <div className="relative">
                  <div className="z-20 relative">
                     <div className="m-4">
                        <div className="grid grid-cols-3 gap-4">
                           <div className="dark:bg-dark350/70 bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                              <div className="text-xs font-bold text-center">
                                 {site.followers}
                              </div>
                              <div className="text-xs text-1 text-center">
                                 Followers
                              </div>
                           </div>
                           <div className="dark:bg-dark350/70 bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                              <div className="text-xs font-bold text-center">
                                 0
                              </div>
                              <div className="text-xs text-1 text-center">
                                 Posts
                              </div>
                           </div>
                           <div className="dark:bg-dark350/70 bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                              <div className="text-xs text-center font-bold">
                                 3,000
                              </div>
                              <div className="text-xs text-center text-1">
                                 Entries
                              </div>
                           </div>
                        </div>
                        {/* <div className="text-xs text-1 pb-2">Lvl 1</div>
                        <div className="rounded-full h-3 w-full dark:bg-dark500 bg-teal-50 relative overflow-hidden">
                           <span className="absolute top-0 left-0 bg-teal-500 w-40 h-full" />
                        </div> */}
                     </div>
                     {site?.banner && (
                        <div
                           className="bg-3-sub border border-zinc-300 dark:border-zinc-700 flex items-center rounded-lg mx-4
                        justify-center bg-white h-[170px] relative overflow-hidden shadow-sm shadow-1"
                        >
                           <Image
                              url={site?.banner?.url}
                              options="aspect_ratio=16:9&height=400"
                              alt="Site Banner"
                              className=""
                           />
                           <span className="bg-gradient-to-t from-zinc-900 to-transparent  w-full h-full absolute top-0 left-0 z-10" />
                           <div
                              className="absolute [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]
                           text-white bottom-0 font-bold text-sm left-0 p-4 z-20"
                           >
                              {site.name}
                           </div>
                        </div>
                     )}
                     <section
                        className="dark:border-zinc-700 border-color 
                     border dark:bg-dark350/70 rounded-xl m-4 py-4 px-4"
                     >
                        {site.about && (
                           <div className="text-1 text-xs">{site.about}</div>
                        )}
                     </section>
                     <section className="ml-4 py-4 border-b border-color dark:border-zinc-700/40">
                        <div className="flex items-center pb-3">
                           <span className="text-1 text-sm font-bold">
                              Contributors
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           {site.admins?.length === 0 ? null : (
                              <>
                                 {site.admins?.map((user: any) => (
                                    <Tooltip key={user.id}>
                                       <TooltipTrigger>
                                          <div
                                             className="bg-3 shadow-1 flex h-9 w-9 items-center justify-center
                                          overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-600"
                                          >
                                             {user.avatar?.url ? (
                                                <Image
                                                   url={user.avatar?.url}
                                                   options="aspect_ratio=1:1&height=80&width=80"
                                                   alt="User Avatar"
                                                />
                                             ) : (
                                                <Icon
                                                   name="dog"
                                                   className="text-1"
                                                   size={20}
                                                />
                                             )}
                                          </div>
                                       </TooltipTrigger>
                                       <TooltipContent>
                                          {user.username}
                                       </TooltipContent>
                                    </Tooltip>
                                 ))}
                                 <Tooltip key={site?.owner?.id}>
                                    <TooltipTrigger>
                                       <div
                                          className="bg-3 shadow-1 h-9 w-9 overflow-hidden rounded-full 
                                          border border-zinc-200 shadow-sm dark:border-zinc-600"
                                       >
                                          {site?.owner?.avatar?.url ? (
                                             <Image
                                                url={site?.owner?.avatar?.url}
                                                options="aspect_ratio=1:1&height=80&width=80"
                                                alt="User Avatar"
                                             />
                                          ) : (
                                             <div
                                                className="bg-3 shadow-1 flex h-9 w-9 items-center
                                                justify-center overflow-hidden rounded-full shadow-sm dark:border-zinc-700"
                                             >
                                                <Icon
                                                   name="dog"
                                                   className="text-1"
                                                   size={20}
                                                />
                                             </div>
                                          )}
                                       </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                       {site?.owner?.username}
                                    </TooltipContent>
                                 </Tooltip>
                              </>
                           )}
                           <Tooltip>
                              <TooltipTrigger>
                                 <div
                                    className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                                 >
                                    Join
                                 </div>
                              </TooltipTrigger>
                              <TooltipContent>Coming Soon!</TooltipContent>
                           </Tooltip>
                        </div>
                     </section>
                     <section className="ml-5 pt-6 pb-4">
                        <div className="flex items-center pb-3 gap-1.5">
                           <Icon
                              name="flame"
                              className="dark:text-zinc-400 text-zinc-500"
                              size={16}
                           />
                           <span className="text-sm text-1 font-bold">
                              Trending
                           </span>
                        </div>
                        <div className="divide-y divide-color dark:divide-zinc-700/40 border-y border-color dark:border-zinc-700/40 font-semibold">
                           <div className="flex items-center gap-2 px-3 py-2.5 pl-0 group">
                              <div className="text-sm flex-grow group-hover:underline">
                                 Charizard
                              </div>
                              <div className="w-7 h-7 flex-none flex items-center justify-center">
                                 <Icon
                                    name="database"
                                    className="dark:text-zinc-500 text-zinc-400"
                                    size={12}
                                 />
                              </div>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-2.5 pl-0 group">
                              <div className="text-sm flex-grow group-hover:underline">
                                 Longer title that can keep going on like this
                              </div>
                              <div className="w-7 h-7 flex-none flex items-center justify-center">
                                 <Icon
                                    name="component"
                                    className="dark:text-zinc-500 text-zinc-400"
                                    size={14}
                                 />
                              </div>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-2.5 pl-0 group">
                              <div className="text-sm flex-grow group-hover:underline">
                                 Venusaur
                              </div>
                              <div className="w-7 h-7 flex-none flex items-center justify-center">
                                 <Icon
                                    name="database"
                                    className="dark:text-zinc-500 text-zinc-400"
                                    size={12}
                                 />
                              </div>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-2.5 pl-0 group">
                              <div className="text-sm flex-grow group-hover:underline">
                                 Raichu
                              </div>
                              <div className="w-7 h-7 flex-none flex items-center justify-center">
                                 <Icon
                                    name="database"
                                    className="dark:text-zinc-500 text-zinc-400"
                                    size={12}
                                 />
                              </div>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-2.5 pl-0 group">
                              <div className="text-sm flex-grow group-hover:underline">
                                 Another one but with a longer title that can
                                 keep going on like this
                              </div>
                              <div className="w-7 h-7 flex-none flex items-center justify-center">
                                 <Icon
                                    name="pen-square"
                                    className="dark:text-zinc-500 text-zinc-400"
                                    size={12}
                                 />
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
                  <span
                     className="bg-gradient-to-t dark:from-bg2Dark dark:to-transparent from-zinc-50 to-transparent
                              w-full h-full absolute top-0 left-0 z-10"
                  />
                  <div
                     className="pattern-dots absolute left-0 top-0 z-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-2 dark:pattern-zinc-500 dark:pattern-bg-bg2Dark"
                  />
               </div>
               <div className="flex-grow" />
               <AdUnit
                  adType="desktopSquareATF"
                  selectorId="rightSidebarBottomUnit"
                  enableAds={site.enableAds}
                  className="flex [&>div]:my-4 items-center justify-center"
               />
            </div>
         </div>
      </section>
   );
}
