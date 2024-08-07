import { Link, useLoaderData } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { LogoText } from "~/components/Logo";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { useTheme } from "~/utils/client-hints";

import { Contributors } from "./Contributors";
import { DarkModeToggle } from "../action+/theme-toggle";

export function ColumnFour() {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};
   const theme = useTheme();

   return (
      <section className="relative laptop:z-50 laptop:block max-laptop:bg-2-sub max-laptop:border-t max-laptop:border-color">
         <div
            className="flex flex-col laptop:fixed laptop:border-l laptop:shadow-sm laptop:shadow-1 no-scrollbar 
            h-full bg-2-sub laptop:bg-2 border-color laptop:overflow-y-auto laptop:w-[334px] justify-between"
         >
            <div className="laptop:h-full flex flex-col bg-zinc-50 dark:bg-bg2Dark">
               <div className="laptop:sticky top-0 w-full left-0 bg-zinc-50 dark:bg-bg2Dark relative">
                  <div className="max-laptop:max-w-[760px] mx-auto">
                     <section className="grid grid-cols-3 gap-4 p-4 relative z-20">
                        <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                           <div className="text-xs font-bold text-center">
                              {site.followers ? site.followers : "-"}
                           </div>
                           <div className="text-xs text-1 text-center">
                              Followers
                           </div>
                        </div>
                        <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                           <div className="text-xs font-bold text-center">
                              {site.totalPosts ? site.totalPosts : "-"}
                           </div>
                           <div className="text-xs text-1 text-center">
                              Posts
                           </div>
                        </div>
                        <div className="dark:bg-bg3Dark bg-white dark:shadow-zinc-800 shadow-sm border border-color px-3 py-1.5 rounded-lg">
                           <div className="text-xs text-center font-bold">
                              {site.totalEntries ? site.totalEntries : "-"}
                           </div>
                           <div className="text-xs text-center text-1">
                              Entries
                           </div>
                        </div>
                     </section>
                     {site?.banner && (
                        <section
                           className="flex items-center rounded-lg mx-4
                              justify-center overflow-hidden shadow dark:shadow-zinc-800 relative z-20"
                        >
                           <Image
                              height={600}
                              url={site?.banner?.url}
                              options="aspect_ratio=1.9:1"
                              alt="Site Banner"
                              loading="lazy"
                           />
                        </section>
                     )}
                     <div
                        className={clsx(
                           site?.banner ? "mt-4" : "mt-0",
                           "relative z-20 mx-4 pb-4 space-y-1 border-b border-dotted border-zinc-200 dark:border-zinc-700",
                        )}
                     >
                        <div
                           className="font-header
                                     font-bold relative flex items-center gap-1.5 z-20"
                        >
                           {site.status === "verified" && (
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
                           )}
                           {site.name}
                        </div>
                        {site.about && (
                           <div className="text-xs text-1">{site.about}</div>
                        )}
                     </div>
                     <Contributors site={site} />
                  </div>
                  <span
                     className="bg-gradient-to-t dark:from-bg3Dark dark:laptop:from-bg2Dark dark:to-transparent 
                           from-white laptop:from-zinc-50 to-transparent w-full h-full absolute top-0 left-0 z-10"
                  />
                  <div
                     className="pattern-dots absolute left-0 top-0 z-0 h-full
                           w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
                           pattern-size-2 dark:pattern-zinc-400 dark:pattern-bg-bg3Dark"
                  />
               </div>

               {/* @ts-ignore */}
               {site?.trendingPages && site?.trendingPages.length > 0 && (
                  <>
                     <div className="dark:max-laptop:bg-bg3Dark max-laptop:bg-white pt-4 pb-3 w-full relative">
                        <div className="max-laptop:max-w-[728px] max-tablet:px-3 laptop:px-3 mx-auto flex items-center gap-1.5">
                           <Icon
                              name="flame"
                              className="dark:text-zinc-400 text-zinc-500"
                              size={16}
                           />
                           <span className="text-sm text-1 font-bold">
                              Trending
                           </span>
                        </div>
                     </div>
                     <section
                        className="max-laptop:bg-3 flex-1 relative  shadow-sm shadow-1 min-h-[480px]
                      bg-white/50 dark:bg-bg3Dark/30 border-y border-color"
                     >
                        <div
                           className="absolute inset-0 overflow-auto divide-y divide-dotted divide-color 
                           dark:scrollbar-thumb-dark500 dark:scrollbar-track-bg3Dark pb-[50px]
                           scrollbar-thumb-zinc-200 scrollbar-track-white scrollbar"
                        >
                           {/* @ts-ignore */}
                           {site?.trendingPages?.map((row: any) => (
                              <Link
                                 to={row.path}
                                 key={row.path}
                                 className="flex items-center max-laptop:max-w-[750px] mx-auto
                                  gap-2 pl-3.5 p-2 group hover:bg-white dark:hover:bg-bg2Dark"
                              >
                                 <div
                                    className="text-sm flex-grow group-hover:underline decoration-zinc-400 dark:decoration-zinc-500
                                 underline-offset-2 font-semibold"
                                 >
                                    {row.data.name}
                                 </div>
                                 <div
                                    className="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-white
                                    border border-color-sub shadow-sm shadow-1 overflow-hidden flex-none dark:bg-dark400"
                                 >
                                    {row.data?.icon?.url ? (
                                       <Image
                                          width={40}
                                          height={40}
                                          url={row.data?.icon?.url}
                                          options="aspect_ratio=1:1&height=40&width=40"
                                          alt=""
                                          loading="lazy"
                                       />
                                    ) : (
                                       <Icon
                                          name="component"
                                          className="dark:text-zinc-500 text-zinc-400 mx-auto"
                                          size={16}
                                       />
                                    )}
                                 </div>
                              </Link>
                           ))}
                        </div>
                     </section>
                  </>
               )}
               <div className="max-laptop:py-5 border-t border-color h-[54px] flex items-center px-3.5 laptop:w-[333px] bg-3 laptop:bg-2 z-10 laptop:fixed bottom-0 right-0">
                  <div className="justify-between w-full flex items-center max-laptop:max-w-[728px] mx-auto gap-3">
                     {!site.isWhiteLabel && (
                        <Link
                           to="https://mana.wiki"
                           className="flex items-center gap-1.5 justify-start laptop:justify-end group"
                        >
                           <span className="dark:text-zinc-500 text-zinc-400 text-xs font-semibold">
                              Powered by
                           </span>
                           <LogoText className="w-12 text-1 group-hover:dark:text-zinc-300 group-hover:text-zinc-600" />
                        </Link>
                     )}
                     {site.isWhiteLabel &&
                        site?.logoDarkImage?.url &&
                        site?.logoLightImage?.url &&
                        site?.logoURL && (
                           <Link
                              to={site?.logoURL}
                              className="flex-grow flex items-center justify-start"
                           >
                              <Image
                                 className="object-contain flex-grow text-left h-6 max-w-[140px]"
                                 width={280}
                                 height={48}
                                 url={
                                    theme === "light"
                                       ? site?.logoLightImage?.url
                                       : site?.logoDarkImage?.url
                                 }
                              />
                           </Link>
                        )}
                     <div className="flex items-center gap-4 text-xs text-1">
                        <DarkModeToggle className="!size-3.5" />
                        <LoggedOut>
                           <Link
                              to="/join"
                              className="group relative inline-flex h-7 items-center justify-center overflow-hidden flex-none
                           rounded-lg laptop:rounded-md px-2.5 font-medium text-indigo-600 transition duration-300 ease-out shadow-sm shadow-1"
                           >
                              <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                              <span
                                 className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                              rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                              ></span>
                              <span className="relative text-xs laptop:text-[10px] font-bold text-white uppercase">
                                 Sign up
                              </span>
                           </Link>
                        </LoggedOut>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
