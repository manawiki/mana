import { NavLink } from "@remix-run/react";
import clsx from "clsx";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

export function PrimaryMenu({
   className,
   isSidebar,
}: {
   className?: string;
   isSidebar?: boolean;
}) {
   return (
      <div
         className={clsx(
            "flex flex-col",
            isSidebar
               ? "p-2 gap-0.5 max-desktop:items-center max-desktop:gap-2"
               : "gap-1.5",
            className,
         )}
      >
         <NavLink
            // prefetch="intent"
            end
            className={({ isActive }) =>
               clsx(
                  isActive
                     ? "bg-zinc-200/40 dark:bg-dark350"
                     : "hover:dark:bg-dark350 hover:bg-zinc-200/40 text-1",
                  !isSidebar && "p-1.5",
                  "flex items-center gap-3 max-desktop:justify-center desktop:p-1.5 rounded-lg relative group",
               )
            }
            to="/"
         >
            {({ isActive }) => (
               <div className="flex items-center gap-3 w-full max-desktop:justify-center">
                  <div
                     className={clsx(
                        isActive
                           ? "dark:bg-blue-900 bg-blue-200"
                           : "dark:bg-dark450 bg-zinc-200/50",
                        isSidebar && "max-desktop:size-8 size-6",
                        "rounded-md size-6 flex items-center justify-center dark:group-hover:bg-blue-900 group-hover:bg-blue-200",
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
                  <div
                     className={clsx(
                        isSidebar && "max-desktop:hidden",
                        "flex-grow font-semibold text-sm",
                     )}
                  >
                     Home
                  </div>
               </div>
            )}
         </NavLink>
         <NavLink
            // prefetch="intent"
            className={({ isActive }) =>
               clsx(
                  isActive
                     ? "bg-zinc-200/40 dark:bg-dark350"
                     : "hover:dark:bg-dark350 hover:bg-zinc-200/40 text-1",
                  !isSidebar && "p-1.5",
                  "flex items-center gap-3 max-desktop:justify-center desktop:p-1.5 rounded-lg relative group",
               )
            }
            to="/collections"
         >
            {({ isActive }) => (
               <div className="flex items-center gap-3  w-full max-desktop:justify-center">
                  <div
                     className={clsx(
                        isActive
                           ? "dark:bg-yellow-900 bg-yellow-200"
                           : "dark:bg-dark450 bg-zinc-200/50",
                        isSidebar && "max-desktop:size-8 size-6",
                        "size-6 rounded-md flex items-center justify-center dark:group-hover:bg-yellow-900 group-hover:bg-yellow-200",
                     )}
                  >
                     <Icon
                        name="database"
                        title="Collections"
                        size={12}
                        className={clsx(
                           isActive
                              ? "dark:text-yellow-300 text-yellow-600"
                              : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-yellow-300 group-hover:text-yellow-600",
                        )}
                     />
                  </div>
                  <div
                     className={clsx(
                        isSidebar && "max-desktop:hidden",
                        "flex-grow font-semibold text-sm",
                     )}
                  >
                     Collections
                  </div>
               </div>
            )}
         </NavLink>
         <NavLink
            // prefetch="intent"
            className={({ isActive }) =>
               clsx(
                  isActive
                     ? "bg-zinc-200/40 dark:bg-dark350"
                     : "hover:dark:bg-dark350 hover:bg-zinc-200/40 text-1",
                  !isSidebar && "p-1.5",
                  "flex items-center gap-3 max-desktop:justify-center desktop:p-1.5 rounded-lg relative group",
               )
            }
            to="/posts"
         >
            {({ isActive }) => (
               <div className="flex items-center gap-3  w-full max-desktop:justify-center">
                  <div
                     className={clsx(
                        isActive
                           ? "dark:bg-emerald-900 bg-emerald-200"
                           : "dark:bg-dark450 bg-zinc-200/50",
                        isSidebar && "max-desktop:size-8 size-6",
                        "size-6 rounded-md flex items-center justify-center dark:group-hover:bg-emerald-900 group-hover:bg-emerald-200",
                     )}
                  >
                     <Icon
                        name="square-pen"
                        title="Posts"
                        size={11}
                        className={clsx(
                           isActive
                              ? "dark:text-emerald-300 text-emerald-600"
                              : "dark:text-zinc-300 text-zinc-500 group-hover:dark:text-emerald-300 group-hover:text-emerald-600",
                        )}
                     />
                  </div>
                  <div
                     className={clsx(
                        isSidebar && "max-desktop:hidden",
                        "flex-grow font-semibold text-sm",
                     )}
                  >
                     Posts
                  </div>
               </div>
            )}
         </NavLink>
         <NavLink
            // prefetch="intent"
            className={({ isActive }) =>
               clsx(
                  isActive
                     ? "bg-zinc-200/40 dark:bg-dark350"
                     : "hover:dark:bg-dark350 hover:bg-zinc-200/40 text-1",
                  !isSidebar && "p-1.5",
                  "flex items-center gap-3 max-desktop:justify-center desktop:p-1.5 rounded-lg relative group",
               )
            }
            to="/community"
         >
            {({ isActive }) => (
               <div className="flex items-center gap-3  w-full max-desktop:justify-center">
                  <div
                     className={clsx(
                        isActive
                           ? "dark:bg-purple-900 bg-purple-200"
                           : "dark:bg-dark450 bg-zinc-200/50",
                        isSidebar && "max-desktop:size-8 size-6",
                        "dark:bg-dark450 bg-zinc-200/50 rounded-md size-6 flex items-center justify-center dark:group-hover:bg-purple-900 group-hover:bg-purple-200",
                     )}
                  >
                     <Icon
                        name="message-circle"
                        title="Community"
                        size={12}
                        className="dark:text-zinc-300 text-zinc-500 group-hover:dark:text-purple-300 group-hover:text-purple-500"
                     />
                  </div>
                  <div
                     className={clsx(
                        isSidebar && "max-desktop:hidden",
                        "flex-grow font-semibold text-sm",
                     )}
                  >
                     Community
                  </div>
               </div>
            )}
         </NavLink>
      </div>
   );
}
