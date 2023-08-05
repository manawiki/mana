import { Link } from "@remix-run/react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DarkModeToggle } from "~/components";
import type { Site } from "~/db/payload-types";
import {
   LoggedIn,
   LoggedInDropDown,
   LoggedOut,
   NotFollowingSite,
} from "~/modules/auth";
import { isAdding } from "~/utils";

export const Header = ({
   location,
   site,
   fetcher,
   isMobileApp,
   setFollowerMenuOpen,
}: {
   location: any;
   site: Site;
   fetcher: any;
   isMobileApp: Boolean;
   setFollowerMenuOpen: any;
}) => {
   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);

   return (
      <>
         {!isMobileApp && (
            <header
               className="bg-2 border-color shadow-1 fixed top-0 z-30 flex 
                        h-14 w-full items-center justify-between border-b px-3 laptop:shadow-sm"
            >
               <div className="z-10 flex items-center gap-3">
                  <div className="laptop:hidden">
                     {/* Following menu modal */}
                     <LoggedIn>
                        <div className="flex items-center gap-3">
                           <NotFollowingSite>
                              <div className="flex items-center">
                                 <fetcher.Form className="w-full" method="post">
                                    <button
                                       name="intent"
                                       value="followSite"
                                       className="flex h-8 items-center justify-center rounded-full bg-black
                                                px-3.5 text-sm font-bold text-white dark:bg-white dark:text-black"
                                    >
                                       {adding ? (
                                          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                       ) : (
                                          t("follow.actionFollow")
                                       )}
                                    </button>
                                 </fetcher.Form>
                              </div>
                           </NotFollowingSite>
                           <button
                              className="bg-3 shadow-1 border-color flex items-center justify-center
                                       gap-2 rounded-full border p-1.5 pl-3   text-sm font-bold shadow-sm"
                              onClick={() => setFollowerMenuOpen(true)}
                           >
                              <div className="pr-2 text-xs">My Follows</div>
                              <div className="bg-1 flex h-5 w-5 items-center justify-center rounded-full">
                                 <ChevronDown
                                    className="dark:text-white"
                                    size={14}
                                 />
                              </div>
                           </button>
                        </div>
                     </LoggedIn>
                  </div>
               </div>
               <LoggedInDropDown />
               <LoggedOut>
                  <Link
                     prefetch="intent"
                     reloadDocument={site.type != "custom" && true}
                     to={`/login?redirectTo=/${site.slug}`}
                     className="shadow-1 z-20 flex h-8 items-center justify-center rounded-full bg-zinc-700 px-3.5 text-sm
                              font-bold text-white shadow-sm dark:bg-white dark:text-black laptop:hidden"
                  >
                     Follow
                  </Link>

                  <div className="relative z-10 flex w-full items-center justify-end gap-3">
                     <DarkModeToggle />
                     <Link
                        prefetch="intent"
                        reloadDocument={site.type != "custom" && true}
                        to="/join"
                        className="shadow-1 group relative inline-flex h-8 items-center justify-center overflow-hidden 
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
                        reloadDocument={site.type != "custom" && true}
                        className="border-color bg-3 shadow-1 flex h-8 items-center
                                 justify-center rounded-lg border px-3 text-center
                                 text-xs font-bold uppercase shadow-sm shadow-zinc-300"
                        to={`/login?redirectTo=${location.pathname}`}
                     >
                        {t("login.action", { ns: "auth" })}
                     </Link>
                  </div>
               </LoggedOut>
               <div
                  className="pattern-opacity-50 pattern-dots absolute left-0 top-0
                           h-full w-full pattern-bg-white pattern-zinc-300 
                           pattern-size-2 dark:pattern-bg-bg1Dark dark:pattern-bg4Dark"
               />
            </header>
         )}
      </>
   );
};
