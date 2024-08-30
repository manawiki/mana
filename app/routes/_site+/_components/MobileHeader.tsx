import { useState } from "react";

import { Link, useFetcher, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarButton } from "~/components/Avatar";
import { Icon } from "~/components/Icon";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { NotFollowingSite } from "~/routes/_auth+/components/NotFollowingSite";
import { isAdding } from "~/utils/form";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";

import { MobileTray } from "./MobileTray";

export function MobileHeader() {
   const { user, following } = useRootLoaderData();

   const { t } = useTranslation(["site", "auth"]);
   const fetcher = useFetcher({ key: "site" });
   const adding = isAdding(fetcher, "followSite");
   const location = useLocation();

   const isNotSite =
      location.pathname.startsWith("/user") ||
      location.pathname.startsWith("/home");

   const [isFollowerMenuOpen, setFollowerMenuOpen] = useState(false);

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
                     <Link
                        className="border border-zinc-300/80 dark:border-zinc-500/80 transition duration-300 shadow-zinc-200/70 dark:shadow-zinc-800/80
                     active:translate-y-0.5 dark:hover:border-zinc-500 rounded-xl flex items-center from-white to-zinc-100
                     justify-center size-9 dark:from-dark500 dark:to-dark400 bg-gradient-to-br shadow-sm hover:border-zinc-300 mx-auto"
                        to={
                           process.env.NODE_ENV === "development"
                              ? "/"
                              : user
                                ? "https://mana.wiki/home"
                                : "https://mana.wiki"
                        }
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 20 20"
                           fill="currentColor"
                           className="size-4"
                        >
                           <path
                              fillRule="evenodd"
                              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                              clipRule="evenodd"
                           />
                        </svg>
                     </Link>
                     {!isNotSite && (
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
                     )}
                     <button
                        className="dark:bg-dark450 bg-white border-zinc-200 shadow-zinc-100 
                      dark:shadow-zinc-800/70 flex items-center justify-center hover:border-zinc-300/80
                        rounded-xl border pr-1.5 pl-3 text-sm font-bold shadow h-9 dark:border-zinc-600 dark:hover:border-zinc-500/60"
                        onClick={() => setFollowerMenuOpen(true)}
                     >
                        <div className="pr-2 text-xs">Follows</div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 dark:bg-dark500">
                           <Icon
                              name="chevron-down"
                              className="dark:text-white"
                              size={14}
                           />
                        </div>
                     </button>
                  </div>
                  <AvatarButton
                     square
                     // prefetch="intent"
                     href="/user/account"
                     src={user?.avatar?.url}
                     initials={user?.username.charAt(0)}
                     className="size-9"
                     options="aspect_ratio=1:1&height=60&width=60"
                  />
               </div>
            </LoggedIn>
            <LoggedOut>
               <Link
                  to={`/login?redirectTo=${location.pathname}`}
                  className="dark:shadow-zinc-950/40 z-20 flex h-8 items-center justify-center rounded-full bg-zinc-700 px-3.5 text-sm
                              font-bold text-white shadow-sm dark:bg-white dark:text-black laptop:hidden"
               >
                  Follow
               </Link>
               <div className="relative z-10 flex w-full items-center justify-end gap-3 py-4 border-b border-color">
                  <Link
                     to="/join"
                     className="group relative inline-flex h-8 items-center justify-center overflow-hidden 
                                 rounded-lg px-3 font-medium text-indigo-600  transition duration-300 ease-out"
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
                     className="dark:border-zinc-600 dark:bg-dark450 flex h-8 items-center shadow-sm shadow-1
                                 justify-center rounded-lg border border-zinc-300 px-3 text-center bg-white
                                 text-xs font-bold uppercase"
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
            <menu className="flex h-full flex-col">
               <LoggedIn>
                  <>
                     {following && following.length > 0 && (
                        <div className="z-20 laptop:hidden">
                           <div className="max-w-[728px] mx-auto shadow-sm overflow-hidden shadow-zinc-50 dark:shadow-zinc-800/30 divide-y dark:divide-zinc-600/70 border dark:border-zinc-600/70 gap-2 rounded-xl bg-zinc-50 dark:bg-dark400">
                              {following.map((partnerSite: any) => {
                                 const path = partnerSite.domain
                                    ? `https://${partnerSite.domain}`
                                    : `https://${partnerSite.slug}.mana.wiki`;
                                 const currentHostname =
                                    typeof window !== "undefined"
                                       ? window.location.hostname
                                       : "";
                                 const hostname = new URL(path).hostname;
                                 const isCurrentSite =
                                    hostname === currentHostname;
                                 return (
                                    <Link
                                       to={path}
                                       key={partnerSite.id}
                                       className={clsx(
                                          isCurrentSite
                                             ? "font-bold bg-zinc-100 dark:bg-dark450"
                                             : "",
                                          "flex items-center relative gap-2.5 p-2 hover:bg-zinc-100 dark:hover:bg-dark450",
                                       )}
                                    >
                                       {isCurrentSite && (
                                          <div className="h-6 w-[3px] block rounded-r-sm absolute left-0 bg-zinc-200 dark:bg-zinc-400" />
                                       )}
                                       <Avatar
                                          src={partnerSite?.icon?.url}
                                          initials={partnerSite?.name?.charAt(
                                             0,
                                          )}
                                          alt="Site Logo"
                                          options="aspect_ratio=1:1&height=120&width=120"
                                          className="size-9 transition duration-300 active:translate-y-0.5"
                                       />
                                       <span className="font-semibold text-sm">
                                          {partnerSite?.name}
                                       </span>
                                    </Link>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                     <Link
                        reloadDocument={true}
                        className="my-4 rounded-xl bg-zinc-800 px-5 py-3
                        text-center text-sm font-bold text-white dark:bg-zinc-200 dark:text-zinc-700"
                        to="https://mana.wiki"
                     >
                        Explore
                     </Link>
                  </>
               </LoggedIn>
            </menu>
         </MobileTray>
      </>
   );
}
