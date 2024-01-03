import { Link, useLocation, useRouteLoaderData } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Site, User } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { NewSiteModal } from "~/routes/_site+/action+/new-site-modal";
import { DarkModeToggle } from "~/routes/_site+/action+/theme-toggle";

import { UserDesktopMenu } from "./UserMenu";

function SideBarItem({ site, siteSlug }: { site: Site; siteSlug?: string }) {
   const sitePath = site.domain ? site.domain : `${site.slug}.mana.wiki`;
   const isActive = siteSlug === site.slug;

   return (
      <a
         className="bg-2 shadow-1 rounded-full shadow"
         href={`https://${sitePath}`}
      >
         <>
            <div className="h-8 w-8 overflow-hidden rounded-full laptop:h-11 laptop:w-11">
               <Image
                  alt="Site Logo"
                  options="aspect_ratio=1:1&height=120&width=120"
                  url={site?.icon?.url ?? ""}
               />
            </div>
            {isActive && (
               <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden" />
            )}
         </>
      </a>
   );
}

export function ColumnOne({ site }: { site: Site }) {
   const { following, siteSlug } = useRouteLoaderData("root") as {
      following: User["sites"];
      user: User;
      siteSlug: string;
   };

   const location = useLocation();

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
                                    <SideBarItem
                                       site={item}
                                       siteSlug={siteSlug}
                                    />
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </div>
                  )}
                  <div className="absolute bottom-3 left-0 w-full">
                     <div className="flex items-center justify-center flex-col gap-2">
                        <UserDesktopMenu />
                     </div>
                  </div>
                  <AdminOrStaffOrOwner>
                     <NewSiteModal />
                  </AdminOrStaffOrOwner>
               </LoggedIn>
               <LoggedOut>
                  <div className="absolute bottom-4 left-0 w-full">
                     <div className="flex items-center justify-center flex-col gap-3">
                        <DarkModeToggle />
                        <Link
                           to={`/login?redirectTo=${location.pathname}`}
                           className="border-4 border-zinc-300 transition duration-300 active:translate-y-0.5 dark:hover:border-zinc-700  
                           rounded-full flex items-center justify-center w-12 h-12 bg-3 dark:border-zinc-700 hover:border-zinc-200"
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
