import { NavLink, useLoaderData } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { SideMenu } from "./sidemenu/SideMenu";

export function ColumnTwo() {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

   return (
      <section className="bg-2 border-color shadow-1 z-50 border-r laptop:shadow-sm laptop:shadow-1">
         <div
            className="fixed bottom-0 flex flex-col top-0 z-50 mx-auto h-full overflow-y-auto shadow-sm  
            max-laptop:hidden laptop:w-[60px] desktop:w-[229px] pb-28
            dark:scrollbar-thumb-dark500 dark:scrollbar-track-bg2Dark
            scrollbar-thumb-zinc-200 scrollbar-track-zinc-50 scrollbar"
         >
            <div className="flex-grow">
               <div className="mx-2.5 mt-2 pt-1.5 mb-0 space-y-0.5">
                  <NavLink
                     prefetch="intent"
                     end
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-zinc-200/40 dark:bg-dark350"
                              : "hover:dark:bg-dark350 hover:bg-zinc-200/40",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative group",
                        )
                     }
                     to="/"
                  >
                     {({ isActive }) => (
                        <div className="flex items-center desktop:gap-3.5 w-full max-desktop:justify-center">
                           <div
                              className={clsx(
                                 isActive
                                    ? "dark:bg-blue-900 bg-blue-200"
                                    : "dark:bg-dark450 bg-zinc-200",
                                 "size-6  rounded-md flex items-center justify-center dark:group-hover:bg-blue-900 group-hover:bg-blue-200",
                              )}
                           >
                              <Icon
                                 name="home"
                                 title="Home"
                                 size={12}
                                 className={clsx(
                                    isActive
                                       ? "dark:text-blue-300 text-blue-500"
                                       : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-blue-300 group-hover:text-blue-500",
                                 )}
                              />
                           </div>
                           <div className="max-desktop:hidden flex-grow font-semibold text-sm">
                              Home
                           </div>
                        </div>
                     )}
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-zinc-200/40 dark:bg-dark350"
                              : "hover:dark:bg-dark350 hover:bg-zinc-200/40",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative group",
                        )
                     }
                     to="/collections"
                  >
                     {({ isActive }) => (
                        <div className="flex items-center desktop:gap-3.5 w-full max-desktop:justify-center">
                           <div
                              className={clsx(
                                 isActive
                                    ? "dark:bg-yellow-900 bg-yellow-200"
                                    : "dark:bg-dark450 bg-zinc-200",
                                 "size-6  rounded-md flex items-center justify-center dark:group-hover:bg-yellow-900 group-hover:bg-yellow-200",
                              )}
                           >
                              <Icon
                                 name="database"
                                 title="Collections"
                                 size={12}
                                 className={clsx(
                                    isActive
                                       ? "dark:text-yellow-300 text-yellow-600"
                                       : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-yellow-300 group-hover:text-yellow-500",
                                 )}
                              />
                           </div>
                           <div className="max-desktop:hidden flex-grow font-semibold text-sm">
                              Collections
                           </div>
                        </div>
                     )}
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-zinc-200/40 dark:bg-dark350"
                              : "hover:dark:bg-dark350 hover:bg-zinc-200/40",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative group",
                        )
                     }
                     to="/posts"
                  >
                     {({ isActive }) => (
                        <div className="flex items-center desktop:gap-3.5 w-full max-desktop:justify-center">
                           <div
                              className={clsx(
                                 isActive
                                    ? "dark:bg-emerald-900 bg-emerald-200"
                                    : "dark:bg-dark450 bg-zinc-200",
                                 "size-6  rounded-md flex items-center justify-center dark:group-hover:bg-emerald-900 group-hover:bg-emerald-200",
                              )}
                           >
                              <Icon
                                 name="square-pen"
                                 title="Posts"
                                 size={11}
                                 className={clsx(
                                    isActive
                                       ? "dark:text-emerald-300 text-emerald-600"
                                       : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-emerald-300 group-hover:text-emerald-500",
                                 )}
                              />
                           </div>
                           <div className="max-desktop:hidden flex-grow font-semibold text-sm">
                              Posts
                           </div>
                        </div>
                     )}
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     end
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-zinc-200/40 dark:bg-dark350"
                              : "hover:dark:bg-dark350 hover:bg-zinc-200/40",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative group",
                        )
                     }
                     to="/community"
                  >
                     {({ isActive }) => (
                        <div className="flex items-center desktop:gap-3.5 w-full max-desktop:justify-center">
                           <div
                              className={clsx(
                                 isActive
                                    ? "dark:bg-purple-900 bg-purple-200"
                                    : "dark:bg-dark450 bg-zinc-200",
                                 "size-6  rounded-md flex items-center justify-center dark:group-hover:bg-purple-900 group-hover:bg-purple-200",
                              )}
                           >
                              <Icon
                                 name="message-circle"
                                 title="Community"
                                 size={12}
                                 className={clsx(
                                    isActive
                                       ? "dark:text-purple-300 text-purple-500"
                                       : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-purple-300 group-hover:text-purple-500",
                                 )}
                              />
                           </div>
                           <div className="max-desktop:hidden flex-grow font-semibold text-sm">
                              Community
                           </div>
                        </div>
                     )}
                  </NavLink>
               </div>
               <SideMenu site={site} />
            </div>
         </div>
      </section>
   );
}
