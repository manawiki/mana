import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { settings } from "mana-config";
import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";

import { PinnedSideMenu, activeStyle, defaultStyle } from "./Menu";

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
                  to={`/${site.slug}`}
               >
                  {({ isActive }) => (
                     <Icon
                        name="home"
                        title="Home"
                        className={clsx(
                           isActive
                              ? "dark:text-zinc-400 text-zinc-500"
                              : "text-zinc-400 dark:text-zinc-500",
                           "desktop:mr-0.5 w-[15px] h-[15px]",
                        )}
                     >
                        <span className="max-desktop:hidden">Home</span>
                     </Icon>
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
                     <Icon
                        name="pen-square"
                        title="Posts"
                        size={15}
                        className={clsx(
                           isActive
                              ? "dark:text-zinc-400 text-zinc-500"
                              : "text-zinc-400 dark:text-zinc-500",
                           "desktop:mr-0.5",
                        )}
                     >
                        <span className="max-desktop:hidden">Posts</span>
                     </Icon>
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
                     <Icon
                        name="database"
                        title="Collections"
                        className={clsx(
                           isActive
                              ? "dark:text-zinc-400 text-zinc-500"
                              : "text-zinc-400 dark:text-zinc-500",
                           "desktop:mr-0.5 w-[15px] h-[15px]",
                        )}
                     >
                        <span className="max-desktop:hidden">Collections</span>
                     </Icon>
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
                        <Icon
                           name="hard-drive"
                           title="Site"
                           className="text-zinc-400 dark:text-zinc-500 w-[15px] h-[15px]"
                        >
                           <span className="max-desktop:hidden text-xs">
                              Site
                           </span>
                        </Icon>
                     </a>
                  )}
               </AdminOrStaffOrOwner>
               {user?.roles?.includes("staff") && (
                  <a className={defaultStyle} href="/admin">
                     <Icon
                        name="lock"
                        title="Staff"
                        className="text-zinc-400 dark:text-zinc-500"
                        size={15}
                     >
                        <span className="max-desktop:hidden text-xs">
                           Staff
                        </span>
                     </Icon>
                  </a>
               )}
            </div>
         </div>
      </section>
   );
}
