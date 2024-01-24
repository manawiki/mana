import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { handleLogout } from "~/routes/_auth+/utils/handleLogout.client";

import { UserMenuLink } from "./components/UserMenuLink";

export default function UserLayout() {
   const { sitePath } = useRouteLoaderData("root") as { sitePath: string };

   return (
      <main
         className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_60px_1fr] 
               laptop:grid-flow-col desktop:auto-cols-[76px_230px_1fr]"
      >
         <div className="border-r border-color bg-1 flex items-center flex-col pt-4">
            <Link
               className="rounded-full flex items-center justify-center size-11 
               border-2 border-color bg-white dark:bg-dark350 shadow-sm shadow-1"
               to="/"
            >
               <Icon name="arrow-left" size={18} className="text-1" />
            </Link>
         </div>
         <div className="bg-2 border-r border-color px-3 py-4 flex flex-col justify-between">
            <div className="space-y-1.5">
               <UserMenuLink text="Account" icon="user" to="/user/account" />
               <UserMenuLink
                  text="Billing"
                  icon="credit-card"
                  to="/user/billing"
               />
            </div>
            <button
               onClick={() => {
                  handleLogout(sitePath);
               }}
               type="submit"
               className="desktop:py-2 desktop:px-3 max-desktop:p-2 bg-zinc-200/60 group max-desktop:justify-center
               dark:bg-dark350 text-left text-sm font-bold  gap-4 flex items-center rounded-lg"
            >
               <div className="font-bold flex-grow max-desktop:hidden">
                  Logout
               </div>
               <Icon
                  name="log-out"
                  size={16}
                  className="text-zinc-400 dark:group-hover:text-zinc-300 group-hover:text-zinc-500"
               />
            </button>
         </div>
         <div className="bg-3">
            <Outlet />
         </div>
      </main>
   );
}
