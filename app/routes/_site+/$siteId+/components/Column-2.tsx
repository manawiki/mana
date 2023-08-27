import {
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
   HomeIcon as HomeIconBold,
   PencilSquareIcon as PencilSquareIconBold,
   CircleStackIcon as CircleStackIconBold,
} from "@heroicons/react/24/solid";
import { NavLink } from "@remix-run/react";
import { HardDrive, Lock } from "lucide-react";

import { settings } from "mana-config";
import type { Site, User } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { siteHomeRoot } from "~/utils";

import { PinnedSideMenu, activeStyle, defaultStyle } from "./Menu";

export const ColumnTwo = ({ site, user }: { site: Site; user: User }) => {
   return (
      <section className="bg-2 border-color shadow-1 z-50 border-r">
         <div className="fixed bottom-0 top-0 z-50 mx-auto h-full overflow-y-auto py-4 shadow-sm  max-laptop:hidden laptop:w-[60px] desktop:w-[220px]">
            <div className="space-y-1 px-3">
               <NavLink
                  prefetch="intent"
                  end
                  className={({ isActive }) =>
                     `${isActive ? activeStyle : ""} ${defaultStyle}`
                  }
                  to={siteHomeRoot({ site })}
               >
                  {({ isActive }) => (
                     <>
                        {isActive ? (
                           <HomeIconBold className="h-[17px] w-[17px] text-blue-500" />
                        ) : (
                           <HomeIcon className="h-[17px] w-[17px] text-blue-500" />
                        )}
                        <span className="max-desktop:hidden">Home</span>
                     </>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     `${isActive ? activeStyle : ""} ${defaultStyle}`
                  }
                  to={`/${site.slug}/posts`}
               >
                  {({ isActive }) => (
                     <>
                        {isActive ? (
                           <PencilSquareIconBold className="h-[17px] w-[17px] text-emerald-500" />
                        ) : (
                           <PencilSquareIcon className="h-[17px] w-[17px] text-emerald-500" />
                        )}
                        <span className="max-desktop:hidden">Posts</span>
                     </>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     `${isActive ? activeStyle : ""} ${defaultStyle}`
                  }
                  to={`/${site.slug}/collections`}
               >
                  {({ isActive }) => (
                     <>
                        {isActive ? (
                           <CircleStackIconBold className="h-[17px] w-[17px] text-yellow-500" />
                        ) : (
                           <CircleStackIcon className="h-[17px] w-[17px] text-yellow-500" />
                        )}
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
                        className="flex items-center gap-3.5 px-3 py-2 font-bold"
                        href={`https://${site.slug}-db.${settings.domain}/admin`}
                     >
                        <>
                           <HardDrive
                              className="text-slate-400 dark:text-slate-500"
                              size={15}
                           />
                           <span className="text-xs">Site</span>
                        </>
                     </a>
                  )}
               </AdminOrStaffOrOwner>
               {user?.roles?.includes("staff") && (
                  <a
                     className="flex items-center gap-3.5 px-3 py-2 font-bold"
                     href="/admin"
                  >
                     <>
                        <Lock
                           className="text-slate-400 dark:text-slate-500"
                           size={15}
                        />
                        <span className="text-xs">Staff</span>
                     </>
                  </a>
               )}
            </div>
         </div>
      </section>
   );
};
