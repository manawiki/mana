import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useRouteLoaderData } from "@remix-run/react";
import { DarkModeToggle } from "~/components";
import { LogoFull } from "~/components/LogoFull";
import clsx from "clsx";

export const loader = async ({ request }: LoaderArgs) => {
   return null;
};

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
            <Link to="/" className="absolute left-5 top-5 p-1">
               <LogoFull />
            </Link>
            <div className="absolute right-5 top-5 flex items-center gap-5">
               <DarkModeToggle />
            </div>
         </div>
         <Outlet />
      </main>
   );
}
