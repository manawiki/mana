import { Outlet } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Logo } from "~/components/Logo";

export default function AuthLayout() {
   return (
      <main>
         <div
            className="pattern-dots absolute left-0 top-0 -z-0 h-full w-full pattern-bg-white 
            pattern-zinc-400 pattern-opacity-10 pattern-size-4 dark:pattern-bg-black dark:pattern-zinc-600"
         />
         <div
            className="absolute left-0 top-0 -z-0 h-full w-full bg-gradient-to-b
            from-zinc-200/50 via-transparent to-zinc-50/80 dark:from-bg2Dark/80 dark:to-bg2Dark/50"
         />
         <div className="relative mt-16 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
            <Outlet />
            <div className="flex items-center justify-center pt-10">
               <Button color="light" className="h-11 w-11" href="/">
                  <Logo className="w-5 h-5" />
               </Button>
            </div>
         </div>
      </main>
   );
}
