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
               <div className="space-y-0.5 m-2.5 mb-0">
                  <NavLink
                     prefetch="intent"
                     end
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-blue-50 dark:bg-blue-950/50"
                              : "hover:dark:bg-blue-950/30 hover:bg-blue-50",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative",
                        )
                     }
                     to="/"
                  >
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="size-[21px] dark:bg-blue-900 bg-blue-200 rounded-md flex items-center justify-center">
                           <Icon
                              name="home"
                              title="Home"
                              size={12}
                              className="dark:text-blue-300 text-blue-500"
                           />
                        </div>
                        <div className="max-desktop:hidden flex-grow font-semibold text-xs">
                           Home
                        </div>
                     </div>
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-yellow-50 dark:bg-yellow-950/40"
                              : "hover:dark:bg-yellow-950/30 hover:bg-yellow-50",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative",
                        )
                     }
                     to="/collections"
                  >
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="size-[21px] dark:bg-yellow-900 bg-yellow-200 rounded-md flex items-center justify-center">
                           <Icon
                              name="database"
                              title="Collections"
                              size={12}
                              className="dark:text-yellow-500 text-yellow-600"
                           />
                        </div>
                        <div className="max-desktop:hidden flex-grow font-semibold text-xs">
                           Collections
                        </div>
                     </div>
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-emerald-50 dark:bg-emerald-950/40"
                              : "hover:dark:bg-emerald-950/30 hover:bg-emerald-50",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative",
                        )
                     }
                     to="/posts"
                  >
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="size-[21px] dark:bg-emerald-900 bg-emerald-200 rounded-md flex items-center justify-center">
                           <Icon
                              name="square-pen"
                              title="Posts"
                              size={11}
                              className="dark:text-emerald-500 text-emerald-600"
                           />
                        </div>
                        <div className="max-desktop:hidden flex-grow font-semibold text-xs">
                           Posts
                        </div>
                     </div>
                  </NavLink>
                  <NavLink
                     prefetch="intent"
                     end
                     className={({ isActive }) =>
                        clsx(
                           isActive
                              ? "bg-purple-50 dark:bg-purple-950/10"
                              : "hover:dark:bg-purple-950/20 hover:bg-purple-50",
                           "flex items-center gap-3 text-1 max-desktop:justify-center p-1.5 rounded-lg relative",
                        )
                     }
                     to="/community"
                  >
                     <div className="flex items-center desktop:gap-2 w-full max-desktop:justify-center">
                        <div className="size-[21px] dark:bg-purple-900 bg-purple-200 rounded-md flex items-center justify-center">
                           <Icon
                              name="message-circle"
                              title="Community"
                              size={12}
                              className="dark:text-purple-400 text-purple-500"
                           />
                        </div>
                        <div className="max-desktop:hidden flex-grow font-semibold text-xs">
                           Community
                        </div>
                     </div>
                  </NavLink>
               </div>
               <div className="rounded-full bg-zinc-200 dark:bg-dark400 h-[1px] mx-4 mt-3" />
               <SideMenu site={site} />
            </div>
         </div>
      </section>
   );
}
