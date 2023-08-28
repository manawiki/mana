import clsx from "clsx";
import { Component, Dog, Users } from "lucide-react";

import { DarkModeToggle, Image, LogoText } from "~/components";
import Tooltip from "~/components/Tooltip";
import type { Site } from "~/db/payload-types";
import { LoggedOut } from "~/modules/auth";

import { PinnedList, PrimaryMenuLinks } from "./Menu";

export const ColumnFour = ({
   site,
   isMobileApp,
}: {
   site: Site;
   isMobileApp: Boolean;
}) => {
   return (
      <section
         className="bg-2 border-color relative z-20 max-laptop:mx-auto
                        max-laptop:max-w-[728px] laptop:block laptop:border-l laptop:border-r-0"
      >
         <div
            className={clsx(
               isMobileApp ? "pb-16" : "",
               "flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto"
            )}
         >
            <div className="border-color border-b laptop:pt-14">
               <section className="border-color py-4 max-tablet:border-b max-tablet:px-3 laptop:hidden">
                  <PrimaryMenuLinks site={site} />
                  <PinnedList site={site} />
               </section>
               {site.about && (
                  <section className="border-color border-b p-4 px-4 tablet:px-0 laptop:p-4">
                     <div className="flex items-center gap-1.5 pb-2.5">
                        <Component size={14} />
                        <span className="text-1 text-sm font-bold">About</span>
                     </div>
                     <div className="text-1 text-sm">{site.about}</div>
                  </section>
               )}
               <section className="p-4 px-4 tablet:px-0 laptop:p-4">
                  <div className="flex items-center gap-1.5 pb-3">
                     <Users size={14} />
                     <span className="text-1 text-sm font-bold">
                        Contributors
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     {site.admins?.length === 0 ? null : (
                        <>
                           {site.admins?.map((user: any) => (
                              <Tooltip
                                 key={user.id}
                                 id="site-contributors"
                                 content={user.username}
                              >
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
                                       <Dog className="text-1" size={20} />
                                    )}
                                 </div>
                              </Tooltip>
                           ))}
                           <Tooltip
                              key={site?.owner?.id}
                              id="site-creator"
                              content={site?.owner?.username}
                           >
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
                                       <Dog className="text-1" size={20} />
                                    </div>
                                 )}
                              </div>
                           </Tooltip>
                        </>
                     )}
                     <Tooltip id="join-site" content="Coming Soon!">
                        <div
                           className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                        >
                           Join
                        </div>
                     </Tooltip>
                  </div>
               </section>
            </div>
            <div className="flex-grow"></div>
            {/* <div className="flex items-center justify-center border-zinc-200/40 py-5  dark:border-zinc-700/40 laptop:border-t">
               <div className="h-[250px] w-[300px] rounded-lg bg-zinc-100 dark:bg-zinc-700/20" />
            </div> */}
            {!isMobileApp && (
               <div className="border-color relative border-t p-4 dark:border-zinc-700/40">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        {/* <a
                           className="border-color shadow-1 bg-3 rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm"
                           href="https://mana.wiki"
                        >
                           Get the app
                        </a> */}
                        <LoggedOut>
                           <DarkModeToggle />
                        </LoggedOut>
                     </div>
                     <a className="text-xs" href="https://mana.wiki">
                        <div className="-mb-[1px] text-[8px] font-bold text-zinc-400 dark:text-zinc-500">
                           Powered by
                        </div>
                        <div className="flex justify-end">
                           <LogoText className="w-10 text-zinc-500 dark:text-zinc-400" />
                        </div>
                     </a>
                  </div>

                  <div
                     className="absolute left-0 top-0 -z-10 h-full w-full 
                  bg-gradient-to-r from-white/40 to-white/80 dark:from-bg2Dark/40 dark:to-bg2Dark/80"
                  />
                  <div
                     className="pattern-opacity-50 pattern-dots absolute left-0 top-0 -z-20
                           h-full w-full pattern-bg-white pattern-zinc-300 
                           pattern-size-2 dark:pattern-bg-bg1Dark dark:pattern-bg4Dark"
                  />
               </div>
            )}
         </div>
      </section>
   );
};
