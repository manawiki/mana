import { NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";

import { PinnedSideMenu } from "./Menu";

export function ColumnTwo({ site, user }: { site: Site; user: User }) {
   return (
      <section className="bg-2 border-color shadow-1 z-50 border-r laptop:shadow-sm laptop:shadow-1">
         <div className="fixed bottom-0 flex flex-col top-0 z-50 mx-auto h-full overflow-y-auto shadow-sm  max-laptop:hidden laptop:w-[60px] desktop:w-[219px]">
            <div className="flex-grow">
               <NavLink
                  prefetch="intent"
                  end
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "underline" : "",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2",
                        "relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                        "hover:underline dark:decoration-zinc-700 decoration-zinc-200 underline-offset-4",
                     )
                  }
                  to={`/${site.slug}`}
               >
                  {({ isActive }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="max-desktop:hidden flex-grow font-bold text-sm">
                           Home
                        </div>
                        <div
                           className={clsx(
                              isActive
                                 ? "dark:bg-bg3Dark bg-zinc-200/50 rounded-full"
                                 : "",
                              "p-[9px] flex items-center justify-center",
                           )}
                        >
                           <Icon
                              name="home"
                              title="Home"
                              size={14}
                              className={clsx(
                                 isActive
                                    ? "dark:text-zinc-400 text-zinc-500"
                                    : "text-zinc-400 dark:text-zinc-500",
                              )}
                           />
                        </div>
                     </div>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "underline" : "",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2",
                        "relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                        "hover:underline dark:decoration-zinc-700 decoration-zinc-200 underline-offset-4",
                     )
                  }
                  to={`/${site.slug}/posts`}
               >
                  {({ isActive }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="max-desktop:hidden text-sm font-bold flex-grow">
                           Posts
                        </div>
                        <div
                           className={clsx(
                              isActive
                                 ? "dark:bg-bg3Dark bg-zinc-200/50 rounded-full"
                                 : "",
                              "p-[9px] flex items-center justify-center",
                           )}
                        >
                           <Icon
                              name="pen-square"
                              title="Posts"
                              size={14}
                              className={clsx(
                                 isActive
                                    ? "dark:text-zinc-400 text-zinc-500"
                                    : "text-zinc-400 dark:text-zinc-500",
                              )}
                           />
                        </div>
                     </div>
                  )}
               </NavLink>
               <NavLink
                  prefetch="intent"
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "underline" : "",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2",
                        "relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                        "hover:underline dark:decoration-zinc-700 decoration-zinc-200 underline-offset-4",
                     )
                  }
                  to={`/${site.slug}/collections`}
               >
                  {({ isActive }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="max-desktop:hidden flex-grow text-sm font-bold">
                           Collections
                        </div>
                        <div
                           className={clsx(
                              isActive
                                 ? "dark:bg-bg3Dark bg-zinc-200/50 rounded-full"
                                 : "",
                              "p-[9px] flex items-center justify-center",
                           )}
                        >
                           <Icon
                              name="database"
                              title="Collections"
                              size={14}
                              className={clsx(
                                 isActive
                                    ? "dark:text-zinc-400 text-zinc-500"
                                    : "text-zinc-400 dark:text-zinc-500",
                              )}
                           />
                        </div>
                     </div>
                  )}
               </NavLink>
               <PinnedSideMenu site={site} />
            </div>
         </div>
      </section>
   );
}
