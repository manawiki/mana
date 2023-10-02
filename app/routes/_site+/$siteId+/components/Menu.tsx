import { Link, NavLink, useRouteLoaderData } from "@remix-run/react";
import clsx from "clsx";
import {
   Component,
   Database,
   PenSquare,
   Pin,
   SquareCode,
   User2,
} from "lucide-react";

import { Image } from "~/components";
import type { Site, User } from "~/db/payload-types";
import { LoggedIn } from "~/modules/auth";
import { siteHomePath, siteHomeShouldReload } from "~/utils";

import { pinnedLinkUrlGenerator } from "../utils/pinnedLinkUrlGenerator";

export const activeStyle = `bg-zinc-200/40 dark:bg-bg3Dark`;
export const defaultStyle = `bg-2 hover:bg-zinc-100 flex items-center gap-3 rounded-full font-bold dark:hover:bg-bg3Dark/70 bg-2 text-1 rounded-lg text-sm px-2.5 py-2`;

export const FollowingListMobile = ({
   setMenuOpen,
   isMobileApp,
   site,
}: {
   setMenuOpen?: any;
   isMobileApp: Boolean;
   site?: Site;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="flex-grow space-y-3">
                  {following?.map((item) => (
                     <NavLink
                        reloadDocument={siteHomeShouldReload({
                           site,
                           currentSite: item,
                        })}
                        key={item.id}
                        onClick={() => setMenuOpen(false)}
                        className="shadow-1 bg-3 border-color relative flex w-full items-center justify-between gap-3 rounded-xl border pr-4 shadow-sm"
                        to={siteHomePath({
                           site: item,
                           currentSite: site,
                           isMobileApp,
                        })}
                     >
                        {({ isActive }) => (
                           <>
                              <div className="flex w-full items-center gap-3 truncate p-2">
                                 <div className="h-7 w-7 flex-none ">
                                    <Image
                                       className="border-color overflow-hidden rounded-full border shadow-sm"
                                       width={32}
                                       height={32}
                                       alt="Site Logo"
                                       options="aspect_ratio=1:1&height=120&width=120"
                                       url={item.icon?.url}
                                    />
                                 </div>
                                 <div className="truncate text-sm font-bold">
                                    {item.name}
                                 </div>
                              </div>
                              {isActive && (
                                 <div className="h-2.5 w-2.5 flex-none rounded-full bg-blue-500" />
                              )}
                           </>
                        )}
                     </NavLink>
                  ))}
               </div>
            )}
         </LoggedIn>
      </>
   );
};

export const PinnedSideMenu = ({ site }: { site: Site }) => {
   return (
      <>
         {site?.pinned && site?.pinned?.length > 1 && (
            <>
               <div className="space-y-0.5 pt-6 desktop:pl-3">
                  <div className="flex items-center gap-1.5 pb-2 desktop:gap-2.5 desktop:pl-2.5">
                     <div className="block h-0.5 flex-grow rounded-l-full bg-zinc-100 dark:bg-bg3Dark desktop:hidden" />
                     <div className="text-1 flex items-center gap-3.5 text-sm font-bold">
                        <Pin className="text-zinc-500" size={16} />
                        <span className="max-desktop:hidden">Pinned</span>
                     </div>
                     <div className="block h-0.5 flex-grow rounded-l-full bg-zinc-100 dark:bg-bg3Dark" />
                  </div>
                  <ul className="space-y-0.5 max-desktop:mx-3 desktop:pr-3">
                     {site.pinned?.map((item: any) => (
                        <li key={item.id}>
                           <NavLink
                              prefetch="intent"
                              className={({ isActive }) =>
                                 clsx(
                                    isActive ? activeStyle : "",
                                    `${defaultStyle} !p-2 text-sm font-semibold`,
                                 )
                              }
                              to={pinnedLinkUrlGenerator(
                                 item,
                                 site?.slug ?? "",
                              )}
                           >
                              <div className="h-6 w-6 laptop:w-5 laptop:h-5 flex items-center justify-center">
                                 {item.relation?.value?.icon?.url ? (
                                    <Image
                                       width={80}
                                       height={80}
                                       url={item.relation?.value?.icon?.url}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt="Pinned Icon"
                                    />
                                 ) : (
                                    <Component
                                       className="text-1 mx-auto"
                                       size={24}
                                    />
                                 )}
                              </div>
                              <div className="truncate max-desktop:hidden">
                                 {item.relation.value.name}
                              </div>
                           </NavLink>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="mt-3 block h-0.5 rounded-l-full bg-zinc-100 dark:bg-bg3Dark desktop:ml-6" />
            </>
         )}
      </>
   );
};

export const PinnedList = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange?: any;
}) => {
   return (
      site?.pinned &&
      site?.pinned?.length > 1 && (
         <>
            <div className="flex items-center gap-2 pb-2.5 pl-2 pt-5">
               <Pin className="text-zinc-500" size={14} />
               <span className="text-1 text-sm font-bold">Pinned</span>
            </div>
            <ul className="space-y-2">
               {site.pinned?.map((item: any) => (
                  <li key={item.id}>
                     <Link
                        prefetch="intent"
                        to={pinnedLinkUrlGenerator(item, site?.slug ?? "")}
                     >
                        <div
                           onClick={() => onOpenChange(false)}
                           className="shadow-1 bg-3 border-color relative flex items-center gap-3
                          rounded-xl border p-3 pr-4 text-sm font-bold shadow-sm"
                        >
                           <div className="h-5 w-5">
                              {item.relation?.value?.icon?.url ? (
                                 <Image
                                    width={80}
                                    height={80}
                                    url={item.relation?.value?.icon?.url}
                                    options="aspect_ratio=1:1&height=80&width=80"
                                    alt="Pinned Icon"
                                 />
                              ) : (
                                 <Component
                                    className="text-1 mx-auto"
                                    size={24}
                                 />
                              )}
                           </div>
                           <div className="truncate">
                              {item.relation.value.name}
                           </div>
                        </div>
                     </Link>
                  </li>
               ))}
            </ul>
         </>
      )
   );
};

export const PrimaryMenuLinks = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange?: any;
}) => {
   return (
      <>
         <NavLink
            className="block mb-2"
            prefetch="intent"
            to={`/${site.slug}/posts`}
         >
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-3 border-color relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={() => onOpenChange(false)}
               >
                  <PenSquare
                     size={15}
                     className={clsx(
                        isActive
                           ? "dark:text-zinc-400 text-zinc-500"
                           : "text-zinc-400 dark:text-zinc-500",
                        "desktop:mr-1",
                     )}
                  />
                  <span>Posts</span>
               </div>
            )}
         </NavLink>
         <NavLink
            className="block"
            prefetch="intent"
            to={`/${site.slug}/collections`}
         >
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-3 border-color relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={() => onOpenChange(false)}
               >
                  <Database
                     size={15}
                     className={clsx(
                        isActive
                           ? "dark:text-zinc-400 text-zinc-500"
                           : "text-zinc-400 dark:text-zinc-500",
                        "desktop:mr-1",
                     )}
                  />
                  <span>Collections</span>
               </div>
            )}
         </NavLink>
      </>
   );
};

export const MobileNav = ({
   isMobileApp,
   setFollowerMenuOpen,
   setUserMenuOpen,
}: {
   isMobileApp: Boolean;
   setFollowerMenuOpen: any;
   setUserMenuOpen: any;
}) => {
   return (
      <>
         {isMobileApp && (
            <nav
               className="border-color fixed inset-x-0 bottom-0 z-50 h-16 w-full border-t border-gray-100
                        bg-white/90 backdrop-blur-lg dark:bg-bg3Dark/80"
            >
               <div className="grid grid-cols-2 gap-2">
                  <button
                     className="group touch-manipulation space-y-1 p-3"
                     onClick={() => setFollowerMenuOpen(true)}
                  >
                     <SquareCode
                        className="mx-auto h-6 w-6 text-zinc-700 transition duration-300 group-active:translate-y-0.5 dark:text-zinc-100"
                        aria-hidden="true"
                     />
                     <div className="text-1 text-center text-[9px] font-bold">
                        Following
                     </div>
                  </button>
                  <button
                     className="group touch-manipulation space-y-1 p-3"
                     onClick={() => setUserMenuOpen(true)}
                  >
                     <User2
                        className="mx-auto h-6 w-6 text-zinc-700 transition duration-300 group-active:translate-y-0.5 dark:text-zinc-100"
                        aria-hidden="true"
                     />
                     <div className="text-1 text-center text-[9px] font-bold">
                        User
                     </div>
                  </button>
               </div>
            </nav>
         )}
      </>
   );
};
