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
                  text-blue-500 shadow-zinc-300 transition duration-300 hover:bg-gray-50 active:translate-y-0.5
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
               <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:justify-end max-laptop:gap-4 laptop:space-y-3">
                  <Link
                     className="flex h-11 items-center justify-center rounded bg-blue-500 text-center text-sm 
                            font-bold text-white max-laptop:px-3 laptop:h-10 laptop:text-xs"
                     to="/join"
                  >
                     {t("login.signUp")}
                  </Link>
                  <Link
                     className="flex h-11 items-center justify-center rounded bg-zinc-500 text-center text-sm 
                            font-bold text-white max-laptop:px-3 laptop:h-10 laptop:text-xs"
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
