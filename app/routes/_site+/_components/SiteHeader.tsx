import { Fragment } from "react";

import {
   Menu,
   MenuButton,
   MenuItem,
   MenuItems,
   Transition,
} from "@headlessui/react";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { InstantSearch } from "react-instantsearch";

import { DotLoader } from "~/components/DotLoader";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { LogoBW } from "~/components/Logo";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { FollowingSite } from "~/routes/_auth+/components/FollowingSite";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { NotFollowingSite } from "~/routes/_auth+/components/NotFollowingSite";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { isAdding } from "~/utils/form";

import { MenuTrayContent, MobileTray } from "./MobileTray";
import { DarkModeToggle } from "../action+/theme-toggle";
import { searchClient } from "../search/_search";
import { Autocomplete } from "../search/components/Autocomplete";

export function SiteHeader({
   setPrimaryMenuOpen,
   isPrimaryMenu,
}: {
   setPrimaryMenuOpen: (open: boolean) => void;
   isPrimaryMenu: boolean;
}) {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

   const fetcher = useFetcher({ key: "site" });

   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);

   return (
      <section
         className="z-30 w-full laptop:z-50 max-laptop:top-0 shadow-sm dark:shadow-zinc-900/30
        sticky top-0 dark:bg-dark350 bg-white border-color border-b border-zinc-200/50"
      >
         <div
            className="pattern-dots absolute left-0
            top-0 -z-0 h-full
            w-full pattern-bg-white pattern-zinc-500 pattern-opacity-10 
            pattern-size-1 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
         />
         <div className="relative mx-auto w-full laptop:max-w-[732px] laptop:rounded-b-2xl">
            <div className="h-[60px] relative mx-auto flex items-center justify-between">
               <>
                  <div className="flex items-center truncate max-laptop:pl-3">
                     <Link
                        // prefetch="intent"
                        to="/"
                        className="flex items-center group h-14 truncate"
                     >
                        <div
                           className="dark:bg-dark450 border dark:border-zinc-600 shadow-1 bg-zinc-50 overflow-hidden flex-none
                              text-1 flex h-10 w-10 items-center justify-center dark:group-hover:border-zinc-600 border-zinc-300/60
                              rounded-full shadow-sm transition duration-300 active:translate-y-0.5 group-hover:border-zinc-300"
                        >
                           {site?.icon?.url ? (
                              <Image
                                 width={40}
                                 height={40}
                                 //@ts-ignore
                                 url={site.icon?.url}
                                 options="aspect_ratio=1:1&height=120&width=120"
                                 alt="Site Logo"
                              />
                           ) : (
                              <>
                                 <LogoBW className="size-5 text-zinc-400" />
                              </>
                           )}
                        </div>
                        <div className="truncate pl-3 text-sm">
                           <div className="font-bold truncate group-hover:underline decoration-zinc-300 underline-offset-2 dark:decoration-zinc-600">
                              {site.name}
                           </div>
                           {site?.followers && (
                              <div className="text-[10px] flex items-center gap-1">
                                 <Icon
                                    name="users-2"
                                    className="text-1 size-3"
                                 />
                                 <span className="dark:text-zinc-500 text-zinc-400">
                                    {site?.followers}
                                 </span>
                              </div>
                           )}
                        </div>
                     </Link>
                  </div>
                  <div className="flex items-center gap-3 pl-2 max-laptop:pr-3">
                     <FollowingSite>
                        <Menu as="div" className="relative">
                           {({ open }) => (
                              <>
                                 <MenuButton
                                    className="text-1 hover:bg-3 flex h-9 w-9 
                                items-center justify-center rounded-full transition duration-300 active:translate-y-0.5"
                                 >
                                    {open ? (
                                       <Icon
                                          name="x"
                                          className={`${
                                             open &&
                                             "tet-zinc-400 dark:text-zinc-500"
                                          } transition duration-150 ease-in-out w-5 h-5`}
                                       />
                                    ) : (
                                       <>
                                          <Icon
                                             name="settings-2"
                                             className="transition duration-150 ease-in-out w-5 h-5"
                                          />
                                       </>
                                    )}
                                 </MenuButton>
                                 <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                 >
                                    <MenuItems
                                       className="absolute -right-1 z-30 mt-1.5 w-full min-w-[140px]
                                 max-w-md origin-top-right transform transition-all"
                                    >
                                       <div
                                          className="border-color-sub bg-3-sub shadow-1 rounded-lg border
                                            p-1 shadow-md dark:shadow-zinc-800/80 space-y-0.5"
                                       >
                                          <AdminOrStaffOrOwner>
                                             <MenuItem>
                                                <Link
                                                   to="/settings/site"
                                                   className="text-1 text-xs text-left flex w-full items-center gap-3 rounded-lg
                                               p-2 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                >
                                                   <div className="flex-grow">
                                                      Settings
                                                   </div>
                                                   <Icon
                                                      size={14}
                                                      name="settings"
                                                      className="text-zinc-400 w-4.5 h-4.5"
                                                   />
                                                </Link>
                                             </MenuItem>
                                          </AdminOrStaffOrOwner>
                                          <MenuItem>
                                             <button
                                                onClick={() => {
                                                   fetcher.submit(
                                                      { intent: "unfollow" },
                                                      {
                                                         method: "post",
                                                         action:
                                                            "/action/follow",
                                                      },
                                                   );
                                                }}
                                                type="submit"
                                                className="text-1 text-xs text-left flex w-full items-center gap-3 rounded-lg
                                               p-2 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                             >
                                                <div className="flex-grow">
                                                   {t("follow.actionUnfollow")}
                                                </div>
                                                <Icon
                                                   size={14}
                                                   name="log-out"
                                                   className="text-zinc-400 w-4.5 h-4.5"
                                                />
                                             </button>
                                          </MenuItem>
                                       </div>
                                    </MenuItems>
                                 </Transition>
                              </>
                           )}
                        </Menu>
                     </FollowingSite>
                     <LoggedOut>
                        <div className="flex items-center">
                           <Link
                              // prefetch="intent"
                              to={`/login?redirectTo=/`}
                              className="flex h-9 items-center justify-center rounded-full bg-zinc-700 px-3.5
                        text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden"
                           >
                              Follow
                           </Link>
                        </div>
                     </LoggedOut>
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
                              className="flex h-9 items-center justify-center rounded-full bg-black shadow dark:shadow-zinc-950
                                 w-[72px] text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden shadow-zinc-400"
                           >
                              {adding ? (
                                 <DotLoader />
                              ) : (
                                 t("follow.actionFollow")
                              )}
                           </button>
                        </div>
                     </NotFollowingSite>
                     <div className="laptop:!hidden">
                        <DarkModeToggle className="size-5" />
                     </div>
                     <div className="flex items-center justify-center gap-2 hover:border-zinc-400 shadow-sm bg-zinc-100 dark:bg-dark500 border border-zinc-300 dark:border-zinc-500 dark:hover:border-zinc-400 rounded-full size-10">
                        <InstantSearch searchClient={searchClient}>
                           <Autocomplete site={site} />
                        </InstantSearch>
                     </div>
                     <button
                        className="dark:bg-zinc-600 shadow-1 flex size-10 items-center 
                           justify-center border-zinc-300 dark:border-zinc-500
                         dark:hover:border-zinc-400 hover:border-zinc-400
                           transition duration-300 active:translate-y-0.5
                           rounded-lg shadow-sm bg-zinc-100 border shadow-zinc-100 laptop:hidden"
                        aria-label="Menu"
                        onClick={() => setPrimaryMenuOpen(true)}
                     >
                        <Icon name="menu" className="w-5 h-5" />
                     </button>
                     <MobileTray
                        direction="left"
                        onOpenChange={setPrimaryMenuOpen}
                        open={isPrimaryMenu}
                     >
                        <MenuTrayContent
                           onOpenChange={setPrimaryMenuOpen}
                           site={site}
                        />
                     </MobileTray>
                  </div>
               </>
            </div>
         </div>
      </section>
   );
}
