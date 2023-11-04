import { Link, NavLink } from "@remix-run/react";

import { DarkModeToggle, Image } from "~/components";
import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";
import {
   LoggedOut,
   LoggedIn,
   AdminOrStaffOrOwner,
} from "~/routes/_auth+/src/components";
import { NewSiteModal } from "~/routes/action+/new-site-modal";

import { UserDesktopMenu } from "./UserMenu";

function SideBarItem({ site }: { site: Site }) {
   return (
      <NavLink
         prefetch="intent"
         className="bg-2 shadow-1 rounded-full shadow"
         reloadDocument={site.type == "custom" ? true : false}
         to={`/${site.slug}`}
      >
         {({ isActive }) => (
            <>
               <div className="h-8 w-8 overflow-hidden rounded-full laptop:h-11 laptop:w-11">
                  <Image
                     alt="Site Logo"
                     options="aspect_ratio=1:1&height=120&width=120"
                     url={site.icon?.url}
                  />
               </div>
               {isActive && (
                  <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden" />
               )}
            </>
         )}
      </NavLink>
   );
}

export function ColumnOne({ site, user }: { site: Site; user: User }) {
   const following = user?.sites as Site[];

   return (
      <section
         className="bg-1 border-color relative top-0 z-50
         max-laptop:fixed max-laptop:w-full laptop:border-r"
      >
         <div
            className="top-0 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
            laptop:h-full laptop:w-[76px] laptop:overflow-y-auto laptop:pt-4"
         >
            <LoggedOut>
               <div className="relative flex items-center justify-center pb-3">
                  <SideBarItem site={site} />
               </div>
            </LoggedOut>
            <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3">
               <LoggedIn>
                  {following?.length === 0 ? (
                     <div className="relative flex items-center justify-center pb-3">
                        <SideBarItem site={site} />
                     </div>
                  ) : (
                     <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                        <ul
                           className="text-center max-laptop:flex max-laptop:flex-grow
                           max-laptop:gap-3 laptop:mb-4 laptop:space-y-3"
                        >
                           {following?.map((item) => (
                              <li key={item.id}>
                                 <div className="relative flex items-center justify-center">
                                    <SideBarItem site={item} />
                                 </div>
                              </li>
                           ))}
                        </ul>
                        <div className="absolute bottom-3 left-0 w-full">
                           <div className="flex items-center justify-center flex-col gap-2">
                              <UserDesktopMenu />
                           </div>
                        </div>
                        <AdminOrStaffOrOwner>
                           <NewSiteModal />
                        </AdminOrStaffOrOwner>
                     </div>
                  )}
               </LoggedIn>
               <LoggedOut>
                  <div className="absolute bottom-4 left-0 w-full">
                     <div className="flex items-center justify-center flex-col gap-3">
                        <DarkModeToggle />
                        <Link
                           to="/login"
                           className="border border-color transition duration-300 active:translate-y-0.5 dark:hover:border-zinc-700  
                           rounded-full flex items-center justify-center w-12 h-12 bg-3 shadow-sm shadow-1 hover:border-zinc-200"
                        >
                           <Icon name="user" size={20} />
                        </Link>
                     </div>
                  </div>
               </LoggedOut>
            </menu>
         </div>
      </section>
   );
}
