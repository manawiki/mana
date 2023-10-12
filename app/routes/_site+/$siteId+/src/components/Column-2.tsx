import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { Database, HardDrive, Home, Lock, PenSquare } from "lucide-react";

import { settings } from "mana-config";
import type { Site, User } from "~/db/payload-types";
import { siteHomeRoot } from "~/utils";

import { PinnedSideMenu, activeStyle, defaultStyle } from "./Menu";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

export function ColumnTwo({ site, user }: { site: Site; user: User }) {
   return (
      <section className="bg-2 border-color shadow-1 z-50 border-r">
         <div className="fixed bottom-0 top-0 z-50 mx-auto h-full overflow-y-auto py-4 shadow-sm  max-laptop:hidden laptop:w-[60px] desktop:w-[220px]">
            <div className="space-y-1 px-3">
               <NavLink
                  prefetch="intent"
                  end
                  className={({ isActive }) =>
                     clsx(isActive ? activeStyle : "", defaultStyle)
                  }
                  to={siteHomeRoot({ site })}
               >
                  {({ isActive }) => (
                     <>
                        <Home
                           size={15}
                           className={clsx(
                              isActive
                                 ? "dark:text-zinc-400 text-zinc-500"
                                 : "text-zinc-400 dark:text-zinc-500",
                              "desktop:mr-0.5",
                           )}
                        />
                        <span className="max-desktop:hidden">Home</span>
                     </>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     clsx(isActive ? activeStyle : "", defaultStyle)
                  }
                  to={`/${site.slug}/posts`}
               >
                  {({ isActive }) => (
                     <>
                        <PenSquare
                           size={15}
                           className={clsx(
                              isActive
                                 ? "dark:text-zinc-400 text-zinc-500"
                                 : "text-zinc-400 dark:text-zinc-500",
                              "desktop:mr-0.5",
                           )}
                        />
                        <span className="max-desktop:hidden">Posts</span>
                     </>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     clsx(isActive ? activeStyle : "", defaultStyle)
                  }
                  to={`/${site.slug}/collections`}
               >
                  {({ isActive }) => (
                     <>
                        <Database
                           size={15}
                           className={clsx(
                              isActive
                                 ? "dark:text-zinc-400 text-zinc-500"
                                 : "text-zinc-400 dark:text-zinc-500",
                              "desktop:mr-0.5",
                           )}
                        />
                        <span className="max-desktop:hidden">Collections</span>
                     </>
                  )}
               </NavLink>
            </div>
            <PinnedSideMenu site={site} />
            <div className="text-1 space-y-0.5 p-3">
               <AdminOrStaffOrOwner>
                  {site.type == "custom" && (
                     <a
                        className={defaultStyle}
                        href={`https://${site.slug}-db.${settings.domain}/admin`}
                     >
                        <HardDrive
                           className="text-zinc-400 dark:text-zinc-500"
                           size={15}
                        />
                        <span className="max-desktop:hidden text-xs">Site</span>
                     </a>
                  )}
               </AdminOrStaffOrOwner>
               {user?.roles?.includes("staff") && (
                  <a className={defaultStyle} href="/admin">
                     <Lock
                        className="text-zinc-400 dark:text-zinc-500"
                        size={15}
                     />
                     <span className="max-desktop:hidden text-xs">Staff</span>
                  </a>
               )}
            </div>
         </div>
      </section>
   );
}
