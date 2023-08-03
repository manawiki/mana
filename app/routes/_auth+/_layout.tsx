import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";
import clsx from "clsx";

import { DarkModeToggle } from "~/components";
import { LogoFull } from "~/components/LogoFull";

export default function AuthLayout() {
   const { isMobileApp } = useRouteLoaderData("root") as {
      isMobileApp: Boolean;
   };
   return (
      <main>
         <div
            className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 pattern-size-4 dark:pattern-bg-black dark:pattern-zinc-600"
         ></div>
         <div
            className="absolute left-0 top-0 
            h-full w-full bg-gradient-to-b
            from-zinc-200/50 via-transparent to-zinc-50/80 dark:from-bg1Dark/80 dark:to-bg1Dark/50"
         ></div>

         <div className={clsx(isMobileApp ? "hidden " : "")}>
            <Link to="/" className="absolute left-4 top-5">
               <LogoFull />
            </Link>
            <div className="absolute right-4 top-4 flex items-center">
               <DarkModeToggle />
            </div>
         </div>
         <div className="mt-16 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
            <Outlet />
         </div>
      </main>
   );
}
