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
               <NavLink
                  prefetch="intent"
                  end
                  className={({ isActive }) =>
                     clsx(
                        isActive
                           ? "bg-zinc-100/80 text-zinc-600 dark:bg-bg3Dark/35 dark:text-zinc-300"
                           : "hover:dark:bg-bg3Dark/35 hover:bg-zinc-100/80",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2 relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                     )
                  }
                  to="/"
               >
                  {({ isActive, isPending }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        {(isActive || isPending) && (
                           <div className="w-3 h-3 absolute -left-1.5 rounded-full dark:bg-zinc-500 bg-zinc-400" />
                        )}
                        <div className="max-desktop:hidden flex-grow font-bold text-sm">
                           Home
                        </div>
                        <div className="p-[9px] flex items-center justify-center">
                           <Icon
                              name="home"
                              title="Home"
                              size={14}
                              className={clsx(
                                 isActive || isPending
                                    ? "dark:text-zinc-300 text-zinc-500"
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
                        isActive
                           ? "bg-zinc-100/80 dark:bg-bg3Dark/35"
                           : "hover:dark:bg-bg3Dark/35 hover:bg-zinc-100/80",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2 relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                     )
                  }
                  to="/posts"
               >
                  {({ isActive, isPending }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        {(isActive || isPending) && (
                           <div className="w-3 h-3 absolute -left-1.5 rounded-full dark:bg-zinc-500 bg-zinc-400" />
                        )}
                        <div className="max-desktop:hidden flex-grow font-bold text-sm">
                           Posts
                        </div>
                        <div className="p-[9px] flex items-center justify-center">
                           <Icon
                              name="pen-square"
                              title="Posts"
                              size={14}
                              className={clsx(
                                 isActive || isPending
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
                        isActive
                           ? "bg-zinc-100/80 dark:bg-bg3Dark/35"
                           : "hover:dark:bg-bg3Dark/35 hover:bg-zinc-100/80",
                        "flex items-center gap-3 text-1 p-2 max-desktop:justify-center desktop:pl-4 desktop:p-2 relative border-b border-zinc-200/50 dark:border-zinc-700/40",
                     )
                  }
                  to="/collections"
               >
                  {({ isActive, isPending }) => (
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        {(isActive || isPending) && (
                           <div className="w-3 h-3 absolute -left-1.5 rounded-full dark:bg-zinc-500 bg-zinc-400" />
                        )}
                        <div className="max-desktop:hidden flex-grow text-sm font-bold">
                           Collections
                        </div>
                        <div className="p-[9px] flex items-center justify-center">
                           <Icon
                              name="database"
                              title="Collections"
                              size={14}
                              className={clsx(
                                 isActive || isPending
                                    ? "dark:text-zinc-400 text-zinc-500"
                                    : "text-zinc-400 dark:text-zinc-500",
                              )}
                           />
                        </div>
                     </div>
                  )}
               </NavLink>
               <SideMenu site={site} />
            </div>
         </div>
      </section>
   );
}
