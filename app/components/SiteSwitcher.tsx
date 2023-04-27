import {
   useLocation,
   useResolvedPath,
   useRouteLoaderData,
} from "@remix-run/react";
import { LoggedOut, LoggedIn, NotFollowingSite } from "~/modules/auth";
import type { User, Site } from "payload-types";
import { NewSiteModal } from "~/routes/action+/new-site-modal";
import { Transition, Menu } from "@headlessui/react";
import { Fragment } from "react";
import { SiteList } from "./SiteList";
import { MobileUserMenu } from "./MobileUserMenu";
import { HomeLink, SiteNavLink } from "~/components/SiteNavLink";
import { Squares2X2Icon } from "@heroicons/react/24/outline";

export const SiteSwitcher = () => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } =
      (useRouteLoaderData("routes/$siteId") as { site: Site }) ?? {};
   const sites = user?.sites as Site[];

   return (
      <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3 max-laptop:px-3">
         <LoggedIn>
            <>
               <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5">
                  <HomeLink />
                  {site ? (
                     <>
                        <NotFollowingSite>
                           <div className="max-laptop:hidden">
                              <div className="mx-auto mb-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                              <div className="relative flex w-full items-center justify-center laptop:mb-4">
                                 <SiteNavLink site={site} />
                              </div>
                           </div>
                        </NotFollowingSite>
                        {site && (
                           <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3.5 laptop:hidden">
                              <div className="mx-auto mb-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                              <div className="relative flex w-full items-center justify-center laptop:mb-4">
                                 <SiteNavLink site={site} />
                              </div>
                           </div>
                        )}
                     </>
                  ) : (
                     sites?.length === 0 && (
                        <>
                           <div className="mx-auto mb-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                           <NewSiteModal />
                           <MobileUserMenu />
                        </>
                     )
                  )}
               </div>
               {sites?.length === 0 ? null : (
                  <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                     <Menu>
                        <Menu.Button
                           className="3 shadow-1 text-1 flex h-12 w-12 
                                       items-center justify-center rounded-full shadow-sm transition
                                       duration-300 active:translate-y-0.5 laptop:hidden"
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
                                 className="border-color bg-2 mx-3 rounded-xl border-2 p-4 
                                            shadow dark:shadow-black/50"
                              >
                                 <SiteList />
                              </div>
                           </Menu.Items>
                        </Transition>
                     </Menu>
                     <div className="mx-auto mb-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                     <div className="max-laptop:hidden">
                        <SiteList />
                        <NewSiteModal />
                     </div>
                     <MobileUserMenu />
                  </div>
               )}
            </>
         </LoggedIn>
         <LoggedOut>
            <div className="max-laptop:flex max-laptop:w-full max-laptop:items-center max-laptop:justify-between max-laptop:gap-3.5">
               <div className="items-center max-laptop:flex">
                  <div className="max-laptop:flex  max-laptop:items-center max-laptop:gap-3.5">
                     <HomeLink />
                     {site && (
                        <>
                           <div className="h-8 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-700 laptop:hidden"></div>
                           <div className="mx-auto mb-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                           <div className="relative flex items-center justify-center">
                              <SiteNavLink site={site} />
                           </div>
                        </>
                     )}
                  </div>
                  <div className="mx-auto mt-4 h-0.5 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700 max-laptop:hidden"></div>
                  <NewSiteModal />
               </div>
               <MobileUserMenu />
            </div>
         </LoggedOut>
      </menu>
   );
};
