import { useState } from "react";

import { Link, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Icon } from "~/components/Icon";
import { useUserMenuState } from "~/root";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { NotFollowingSite } from "~/routes/_auth+/components/NotFollowingSite";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding } from "~/utils/form";

import { FollowingTrayContent, MobileTray } from "./MobileTray";

export function MobileHeader() {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

   const { t } = useTranslation(["site", "auth"]);
   const fetcher = useFetcher({ key: "site" });
   const adding = isAdding(fetcher, "followSite");
   const location = useLocation();

   const [isFollowerMenuOpen, setFollowerMenuOpen] = useState(false);
   const [setUserMenuOpen] = useUserMenuState();

   return (
      <>
         <header
            className="dark:bg-dark350 bg-white dark:border-zinc-700 laptop:dark:border-zinc-700/20 dark:shadow-zinc-800 fixed top-0 z-30 flex 
                        h-14 w-full items-center justify-between border-b px-3 laptop:shadow-sm laptop:hidden"
         >
            <LoggedIn>
               <div className="flex w-full flex-none items-center justify-between gap-3 laptop:hidden">
                  {/* Following menu modal */}
                  <div className="flex items-center gap-3">
                     <NotFollowingSite>
                        <div className="flex items-center">
                           <button
                              onClick={() => {
                                 fetcher.submit(
                                    { intent: "followSite" },
                                    {
                                       method: "post",
                                       action: "/action/follow",
                                    },
                                 );
                              }}
                              className="flex h-8  w-[72px] items-center justify-center rounded-full bg-black dark:shadow-zinc-950
                                 px-3.5 text-xs font-bold text-white dark:bg-white dark:text-black shadow-zinc-400 shadow"
                           >
                              {adding ? (
                                 <Icon
                                    name="loader-2"
                                    className="mx-auto h-5 w-5 animate-spin"
                                 />
                              ) : (
                                 t("follow.actionFollow")
                              )}
                           </button>
                        </div>
                     </NotFollowingSite>
                     <button
                        className="bg-3-sub shadow-1 border-color-sub flex items-center justify-center
                                       rounded-full border p-1.5 pl-3 text-sm font-bold shadow"
                        onClick={() => setFollowerMenuOpen(true)}
                     >
                        <div className="pr-2 text-xs">My Follows</div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full dark:bg-zinc-700">
                           <Icon
                              name="chevron-down"
                              className="dark:text-white"
                              size={14}
                           />
                        </div>
                     </button>
                  </div>
                  <button
                     className="bg-3-sub shadow-1 border-color-sub flex h-9 w-9 items-center
                     justify-center rounded-xl border shadow-sm"
                     onClick={() => setUserMenuOpen(true)}
                  >
                     <Icon name="user" size={20} />
                  </button>
               </div>
            </LoggedIn>
            <LoggedOut>
               <Link
                  prefetch="intent"
                  reloadDocument={true}
                  to={`/login?redirectTo=${location.pathname}`}
                  className="dark:shadow-zinc-950/40 z-20 flex h-8 items-center justify-center rounded-full bg-zinc-700 px-3.5 text-sm
                              font-bold text-white shadow-sm dark:bg-white dark:text-black laptop:hidden"
               >
                  Follow
               </Link>
               <div className="relative z-10 flex w-full items-center justify-end gap-3 py-4 border-b border-color">
                  <Link
                     prefetch="intent"
                     to="/join"
                     className="dark:shadow-zinc-950/40 group relative inline-flex h-8 items-center justify-center overflow-hidden 
                                 rounded-lg px-3 py-2 font-medium text-indigo-600 shadow shadow-zinc-400 transition duration-300 ease-out"
                  >
                     <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                     <span
                        className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                                    rotate-45 transform rounded-lg bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                     ></span>
                     <span className="relative text-xs font-bold uppercase text-white">
                        {t("login.signUp", { ns: "auth" })}
                     </span>
                  </Link>
                  <Link
                     prefetch="intent"
                     className="dark:border-zinc-600 dark:bg-dark450 dark:shadow-zinc-950/40 flex h-8 items-center
                                 justify-center rounded-lg border px-3 text-center bg-white
                                 text-xs font-bold uppercase shadow-sm shadow-zinc-300"
                     to={`/login?redirectTo=${location.pathname}`}
                  >
                     {t("login.action", { ns: "auth" })}
                  </Link>
               </div>
            </LoggedOut>
            <div
               className="pattern-opacity-50 dark:pattern-dark350 pattern-dots absolute left-0
                           top-0 -z-10 h-full w-full pattern-bg-white 
                           pattern-zinc-200 pattern-size-2 dark:pattern-bg-bg2Dark"
            />
         </header>
         <MobileTray
            onOpenChange={setFollowerMenuOpen}
            open={isFollowerMenuOpen}
         >
            <FollowingTrayContent
               site={site}
               setFollowerMenuOpen={setFollowerMenuOpen}
            />
         </MobileTray>
      </>
   );
}
