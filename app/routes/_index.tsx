import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Logo } from "~/components/Logo";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import { LoggedOut } from "~/modules/auth";
import { NewSiteModal } from "./action.new-site-modal";
import { MobileUserMenu } from "~/components/MobileUserMenu";

export async function loader({
   context: { user, payload },
   request,
}: LoaderArgs) {
   //If subdomain, we want to make /siteId the root
   const host = new URL(request.url).hostname;
   const isSubdomain = host.split(".").length > 2;
   if (
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT != "local" &&
      isSubdomain
   ) {
      const subDomain = host.split(".")[0];
      const result = await payload.find({
         collection: "sites",
         where: {
            subdomain: {
               equals: subDomain,
            },
         },
      });
      const siteId = result.docs[0].id;
      return redirect(`/${siteId}`, 301);
   }
   if (user) {
      return redirect("/home");
   }
   return null;
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

export default function HomeRoot() {
   const { t } = useTranslation(handle?.i18n);
   const location = useLocation();

   return (
      <>
         <div className="laptop:grid laptop:min-h-screen auto-cols-[86px_1fr_334px] laptop:grid-flow-col">
            <section
               className="laptop:bg-1 relative z-40 border-r border-zinc-200 shadow-zinc-500 dark:border-zinc-700
               max-laptop:fixed max-laptop:top-0 max-laptop:h-20  max-laptop:w-full
               max-laptop:bg-gradient-to-b max-laptop:py-4"
            >
               <div
                  className="max-laptop:flex max-laptop:items-center laptop:fixed laptop:top-0 laptop:left-0 laptop:py-4 
                  laptop:h-full laptop:w-[86px] justify-between laptop:overflow-y-auto max-laptop:px-3 max-laptop:gap-3"
               >
                  <div className="max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                     <Link
                        to="/"
                        className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition duration-300 font-logo bg-2
                     active:translate-y-0.5 dark:border-zinc-700 dark:shadow-black
                     laptop:h-14 laptop:w-14 laptop:mx-auto flex-none"
                     >
                        <Logo className="w-6 h-6 laptop:h-7 laptop:w-7" />
                     </Link>
                     <div className="mx-auto mt-4 h-0.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 max-laptop:hidden"></div>
                     <NewSiteModal />
                  </div>
                  <MobileUserMenu />
               </div>
            </section>
            <section className="max-laptop:border-color bg-2 max-laptop:min-h-screen max-laptop:border-b max-laptop:pt-16"></section>
            <section
               className="bg-1 border-color relative max-laptop:mx-auto max-laptop:max-w-[728px] 
               tablet:border-x laptop:border-r-0 laptop:border-l"
            >
               <div className="bg-1 flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <LoggedOut>
                     <div className="max-laptop:hidden grid grid-cols-2 gap-4 p-4">
                        <Link
                           to="/join"
                           className="relative inline-flex items-center justify-center p-4 px-5 py-2 overflow-hidden font-medium 
                           text-indigo-600 transition duration-300 ease-out rounded-full group"
                        >
                           <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                           <span
                              className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left 
                           transform rotate-45 translate-x-24 bg-teal-500 rounded-full opacity-30 group-hover:rotate-90 ease"
                           ></span>
                           <span className="relative text-white font-bold text-sm">
                              {t("login.signUp", { ns: "auth" })}
                           </span>
                        </Link>
                        <Link
                           className="flex h-10 items-center justify-center hover:border hover:border-color
                            rounded-full bg-zinc-100 shadow dark:bg-zinc-800 text-center 
                            text-sm font-bold"
                           to={`/login?redirectTo=${location.pathname}`}
                        >
                           {t("login.action", { ns: "auth" })}
                        </Link>
                     </div>
                  </LoggedOut>
                  <div className="flex-grow"></div>
                  <div className="items-center justify-between pl-3 h-14 pr-5 flex border-t border-color">
                     <div className="flex-none">
                        <DarkModeToggle />
                     </div>
                     <Link className="font-logo text-xl" to="/">
                        mana
                     </Link>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}
