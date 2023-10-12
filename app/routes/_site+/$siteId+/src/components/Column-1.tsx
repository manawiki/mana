import { NavLink } from "@remix-run/react";

import { Image } from "~/components";
import type { Site, User } from "~/db/payload-types";
import { LoggedOut, LoggedIn } from "~/routes/_auth+/src/components";
import { siteHomePath, siteHomeRoot, siteHomeShouldReload } from "~/utils";
// import { NewSiteModal } from "~/routes/action+/new-site-modal";

export const ColumnOne = ({ site, user }: { site: Site; user: User }) => {
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
                  <NavLink
                     prefetch="intent"
                     className="bg-2 shadow-1 rounded-full shadow"
                     to={siteHomeRoot({ site })}
                  >
                     {({ isActive }) => (
                        <>
                           <div
                              className="h-8 w-8 overflow-hidden 
                     rounded-full laptop:h-11 laptop:w-11"
                           >
                              <Image
                                 alt="Site Logo"
                                 options="aspect_ratio=1:1&height=120&width=120"
                                 url={site.icon?.url}
                              />
                           </div>
                           {isActive && (
                              <span
                                 className="absolute -left-1 top-2 h-7 w-2.5 
                     rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
                              />
                           )}
                        </>
                     )}
                  </NavLink>
               </div>
            </LoggedOut>
            <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3">
               <LoggedIn>
                  {following?.length === 0 ? (
                     <div className="relative flex items-center justify-center pb-3">
                        <NavLink
                           prefetch="intent"
                           className="bg-2 shadow-1 rounded-full shadow"
                           to={`/${site.slug}`}
                        >
                           {({ isActive }) => (
                              <>
                                 <div
                                    className="h-8 w-8 overflow-hidden 
                     rounded-full laptop:h-11 laptop:w-11"
                                 >
                                    <Image
                                       alt="Site Logo"
                                       options="aspect_ratio=1:1&height=120&width=120"
                                       url={site.icon?.url}
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
                  ) : (
                     <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                        <ul
                           className="text-center max-laptop:flex max-laptop:flex-grow
                           max-laptop:gap-3 laptop:mb-4 laptop:space-y-3"
                        >
                           {following?.map((item) => (
                              <li key={item.id}>
                                 <div className="relative flex items-center justify-center">
                                    <NavLink
                                       prefetch="intent"
                                       reloadDocument={siteHomeShouldReload({
                                          site,
                                          currentSite: item,
                                       })}
                                       className="bg-2 shadow-1 group rounded-full shadow"
                                       to={siteHomePath({
                                          site: item,
                                          currentSite: site,
                                       })}
                                    >
                                       {({ isActive }) => (
                                          <>
                                             <div
                                                className="h-8 w-8 overflow-hidden rounded-full transition
                                                duration-300 group-active:translate-y-0.5 laptop:h-11 laptop:w-11"
                                             >
                                                <Image
                                                   alt="Site Logo"
                                                   options="aspect_ratio=1:1&height=120&width=120"
                                                   url={item.icon?.url}
                                                />
                                             </div>
                                             {isActive && (
                                                <span
                                                   className="absolute -left-1 top-2 h-7 w-2.5 
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
                        {/* <NewSiteModal /> */}
                     </div>
                  )}
               </LoggedIn>
               {/* <LoggedOut>
                  <div className="items-center justify-center">
                     <NewSiteModal />
                  </div>
               </LoggedOut> */}
            </menu>
         </div>
      </section>
   );
};
