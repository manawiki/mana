import { Outlet } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

import { Icon } from "~/components/Icon";
import { handleLogout } from "~/routes/_auth+/utils/handleLogout.client";

import { UserMenuItems } from "./components/UserMenuItems";
import { ColumnOneMenu } from "../_site+/_components/Column-1-Menu";
import { MobileHeader } from "../_site+/_components/MobileHeader";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   if (!user) throw redirect("/login");

   return null;
}

export default function UserLayout() {
   return (
      <>
         <MobileHeader />
         <main
            className="laptop:grid laptop:min-h-screen laptop:auto-cols-[70px_60px_1fr] 
               laptop:grid-flow-col desktop:auto-cols-[70px_230px_1fr]"
         >
            <section className="bg-1 border-color relative top-0 z-50 max-laptop:fixed max-laptop:w-full laptop:border-r">
               <div
                  className="top-0 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
                  laptop:h-full laptop:w-[70px] laptop:overflow-y-auto laptop:pt-3 no-scrollbar"
               >
                  <ColumnOneMenu />
               </div>
            </section>
            <div className="max-laptop:hidden bg-2 border-r border-color px-3 py-4 flex flex-col justify-between">
               <UserMenuItems />
               <button
                  onClick={() => {
                     handleLogout();
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
      </>
   );
}
