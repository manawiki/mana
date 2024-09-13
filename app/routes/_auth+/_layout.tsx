import { Outlet } from "@remix-run/react";

import { Button } from "~/components/Button";

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
               <Button color="light/zinc" className="size-11" href="/">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20"
                     fill="currentColor"
                     className="size-5"
                  >
                     <path
                        fillRule="evenodd"
                        d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                        clipRule="evenodd"
                     />
                  </svg>
               </Button>
            </div>
         </div>
      </main>
   );
}
