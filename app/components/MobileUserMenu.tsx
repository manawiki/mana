import { Link, useLocation } from "@remix-run/react";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoggedOut, LoggedIn } from "~/modules/auth";

export const MobileUserMenu = () => {
   const { t } = useTranslation("auth");
   const location = useLocation();
   return (
      <>
         <LoggedIn>
            <div className="laptop:bg-1 flex items-center justify-center laptop:fixed laptop:bottom-0 laptop:w-[84px] laptop:pt-4 laptop:pb-5">
               <Link
                  to="/user"
                  className="mx-auto flex h-12 w-12 items-center justify-center 
                  rounded-full border-2 bg-white 
                  text-1 shadow-zinc-300 transition duration-300 hover:bg-gray-50 active:translate-y-0.5
                  dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black dark:hover:bg-zinc-700
                  laptop:h-14 laptop:w-14 laptop:shadow"
                  aria-label="User Profile"
               >
                  <User className="h-6 w-6" />
               </Link>
            </div>
         </LoggedIn>
         <LoggedOut>
            <div className="w-full max-w-[728px] laptop:hidden">
               <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:justify-end max-laptop:gap-3 laptop:space-y-3">
                  <Link
                     to="/join"
                     className="relative inline-flex items-center justify-center px-3.5 py-2.5 overflow-hidden font-medium 
                           text-indigo-600 transition duration-300 ease-out rounded-full group"
                  >
                     <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                     <span
                        className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left 
                           transform rotate-45 translate-x-24 bg-teal-500 rounded-full opacity-30 group-hover:rotate-90 ease"
                     ></span>
                     <span className="relative text-white font-bold text-sm truncate">
                        {t("login.signUp")}
                     </span>
                  </Link>
                  <Link
                     className="flex h-10 px-3.5 items-center justify-center 
                           rounded-full bg-zinc-100 shadow dark:bg-zinc-700 text-center 
                           text-sm font-bold truncate"
                     to={`/login?redirectTo=${location.pathname}`}
                  >
                     {t("login.action")}
                  </Link>
               </div>
            </div>
         </LoggedOut>
      </>
   );
};
