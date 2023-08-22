import { Link, Outlet } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
export default function AuthLayout() {
   return (
      <main>
         <div
            className="pattern-dots absolute left-0 top-0 -z-0 h-full w-full pattern-bg-white 
            pattern-zinc-400 pattern-opacity-10 pattern-size-4 dark:pattern-bg-black dark:pattern-zinc-600"
         />
         <div
            className="absolute left-0 top-0 -z-0 h-full w-full bg-gradient-to-b
            from-zinc-200/50 via-transparent to-zinc-50/80 dark:from-bg1Dark/80 dark:to-bg1Dark/50"
         />
         <div className="relative mt-16 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
            <Outlet />
            <div className="flex items-center justify-center pt-10">
               <Link
                  className="bg-2 border-color shadow-1 flex items-center gap-2 rounded-full border py-2 pl-3 pr-4 text-sm font-bold shadow-sm"
                  to="/"
               >
                  <ArrowLeft className="text-1" size={16} />
                  <span>Back</span>
               </Link>
            </div>
         </div>
      </main>
   );
}
