import { useRouteLoaderData, NavLink } from "@remix-run/react";
import { LoggedOut, LoggedIn } from "~/modules/auth";
import type { User, Site } from "payload-types";
import { NewSiteModal } from "~/routes/action+/new-site-modal";
import { Image } from "./Image";

export const SiteSwitcher = () => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const sites = user?.sites as Site[];

   return (
      <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3">
         <LoggedIn>
            {sites?.length === 0 ? null : (
               <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                  <ul
                     className="text-center max-laptop:flex max-laptop:flex-grow
                   max-laptop:gap-3  laptop:mb-4 laptop:space-y-3"
                  >
                     {sites?.map((item) => (
                        <li key={item.id}>
                           <div className="relative flex items-center justify-center">
                              <NavLink
                                 className="bg-2 shadow-1 shadow-1 rounded-full shadow-sm"
                                 to={`/${item.slug}`}
                              >
                                 {({ isActive }) => (
                                    <>
                                       <div
                                          className="h-8 w-8 overflow-hidden 
                                    rounded-full laptop:h-[50px] laptop:w-[50px]"
                                       >
                                          <Image
                                             alt="Site Logo"
                                             options="fit=crop,width=88,height=88,gravity=auto"
                                             url={item.icon?.url}
                                          />
                                       </div>
                                       {isActive && (
                                          <span
                                             className="absolute -left-1 top-2 h-9 w-2.5 
                                    rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
                                          />
                                       )}
                                    </>
                                 )}
                              </NavLink>
                           </div>
                        </li>
                     ))}
                  </ul>
                  <NewSiteModal />
               </div>
            )}
         </LoggedIn>
         <LoggedOut>
            <div className="items-center justify-center">
               <NewSiteModal />
            </div>
         </LoggedOut>
      </menu>
   );
};
