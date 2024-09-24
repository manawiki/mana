import { Link, useLocation } from "@remix-run/react";

import { LoggedOut } from "./LoggedOut";

export const LoggedOutMobile = () => {
   const location = useLocation();

   return (
      <LoggedOut>
         <div className="grid w-full grid-cols-2 gap-4">
            <Link
               to="/join"
               className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden 
        rounded-full p-4 px-5 font-medium text-indigo-600 transition duration-300 ease-out"
            >
               <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
               <span
                  className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
        rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
               ></span>
               <span className="relative text-sm font-bold text-white">
                  Sign up
               </span>
            </Link>
            <Link
               className="dark:bg-dark400 flex h-10 w-full items-center justify-center
        rounded-full border border-zinc-200 bg-zinc-100 text-center text-sm
       font-bold dark:border-zinc-600"
               to={`/login?redirectTo=${location.pathname}`}
            >
               Log in
            </Link>
         </div>
      </LoggedOut>
   );
};
