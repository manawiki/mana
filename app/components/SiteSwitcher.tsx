import { useRouteLoaderData } from "@remix-run/react";
import { LoggedOut, LoggedIn, NotFollowingSite } from "~/modules/auth";
import type { User, Site } from "@mana/db";
import { NewSiteModal } from "~/routes/action.new-site-modal";
import { Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import { SiteList } from "./SiteList";
import { UserMenu } from "./UserMenu";
import { HomeLink, SiteNavLink } from "~/components/SiteNavLink";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

export const SiteSwitcher = () => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } =
      (useRouteLoaderData("routes/$siteId") as { site: Site }) ?? {};
   const sites = user?.sites as Site[];
   return (
      <menu className="max-laptop:flex max-laptop:px-3 max-laptop:gap-3 w-full justify-between">
         <LoggedIn>
            <>
               <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5">
                  <HomeLink site={site} />
                  {site ? (
                     <>
                        <NotFollowingSite>
                           <div className="max-laptop:hidden">
                              <div className="max-laptop:hidden mx-auto mb-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                              <div className="h-8 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 laptop:hidden"></div>
                              <div className="relative flex w-full items-center justify-center laptop:mb-4">
                                 <SiteNavLink site={site} currentSite={site} />
                              </div>
                           </div>
                        </NotFollowingSite>
                        {site && (
                           <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5 laptop:hidden">
                              <div className="max-laptop:hidden mx-auto mb-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                              <div className="h-8 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 laptop:hidden"></div>
                              <div className="relative flex w-full items-center justify-center laptop:mb-4">
                                 <SiteNavLink site={site} currentSite={site} />
                              </div>
                           </div>
                        )}
                     </>
                  ) : (
                     sites?.length === 0 && (
                        <>
                           <div className="max-laptop:hidden mx-auto mb-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                           <NewSiteModal />
                           <UserMenu />
                        </>
                     )
                  )}
               </div>
               {sites?.length === 0 ? null : (
                  <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                     <Menu>
                        <Menu.Button
                           className="flex h-12 w-12 items-center justify-center rounded-full 
                                        border-2 bg-white text-blue-500 transition duration-300
                                        active:translate-y-0.5 dark:border-zinc-700
                                        dark:bg-zinc-800 laptop:hidden"
                        >
                           <Squares2X2Icon className="h-6 w-6" />
                        </Menu.Button>
                        <Transition
                           as={Fragment}
                           enter="transition ease-out duration-100"
                           enterFrom="transform opacity-0 scale-95"
                           enterTo="transform opacity-100 scale-100"
                           leave="transition ease-in duration-75"
                           leaveFrom="transform opacity-100 scale-100"
                           leaveTo="transform opacity-0 scale-95"
                        >
                           <Menu.Items
                              className="absolute right-0 top-16 mt-2 w-full 
                                        origin-top-right transform transition-all"
                           >
                              <div
                                 className="border-color mx-3 rounded-xl border-2 bg-white p-4 
                                            shadow dark:bg-zinc-800 dark:shadow-black/50"
                              >
                                 <SiteList />
                              </div>
                           </Menu.Items>
                        </Transition>
                     </Menu>
                     <div className="max-laptop:hidden mx-auto mb-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                     <div className="max-laptop:hidden">
                        <SiteList />
                        <NewSiteModal />
                     </div>
                     <UserMenu />
                  </div>
               )}
            </>
         </LoggedIn>
         <LoggedOut>
            <div className="max-laptop:flex max-laptop:w-full max-laptop:justify-between max-laptop:items-center max-laptop:gap-3.5">
               <div className="max-laptop:flex  max-laptop:items-center max-laptop:gap-3.5">
                  <HomeLink site={site} />
                  {site && (
                     <>
                        <div className="h-8 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 laptop:hidden"></div>
                        <div className="max-laptop:hidden mx-auto mb-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
                        <div className="relative flex items-center justify-center">
                           <SiteNavLink site={site} currentSite={site} />
                        </div>
                     </>
                  )}
               </div>
               <div className="max-laptop:hidden mx-auto mt-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
               <NewSiteModal />
               <UserMenu />
            </div>
         </LoggedOut>
      </menu>
   );
};
