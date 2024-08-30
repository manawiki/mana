import { Link } from "@remix-run/react";

import { Image } from "~/components/Image";
import { LogoText } from "~/components/Logo";
import type { Site } from "~/db/payload-types";
import { LoggedOut } from "~/routes/_auth+/components/LoggedOut";
import { useTheme } from "~/utils/client-hints";

import { DarkModeToggle } from "../action+/theme-toggle";

export function BrandingFooter({ site }: { site: Site }) {
   const theme = useTheme();

   return (
      <div className="max-laptop:py-5 border-t border-color h-[54px] bg-2 flex items-center px-3.5 laptop:w-[333px] z-40">
         <div className="justify-between w-full flex items-center max-laptop:max-w-[728px] mx-auto gap-3">
            {!site.isWhiteLabel && (
               <Link
                  to="https://mana.wiki"
                  className="flex items-center gap-1.5 justify-start laptop:justify-end group"
               >
                  <span className="dark:text-zinc-500 text-zinc-400 text-xs font-semibold">
                     Powered by
                  </span>
                  <LogoText className="w-12 text-1 group-hover:dark:text-zinc-300 group-hover:text-zinc-600" />
               </Link>
            )}
            {site.isWhiteLabel &&
               site?.logoDarkImage?.url &&
               site?.logoLightImage?.url &&
               site?.logoURL && (
                  <Link
                     to={site?.logoURL}
                     className="flex-grow flex items-center justify-start"
                  >
                     <Image
                        className="object-contain flex-grow text-left h-6 max-w-[140px]"
                        width={280}
                        height={48}
                        url={
                           theme === "light"
                              ? site?.logoLightImage?.url
                              : site?.logoDarkImage?.url
                        }
                     />
                  </Link>
               )}
            <div className="flex items-center gap-4 text-xs text-1">
               <DarkModeToggle className="!size-3.5" />
               <LoggedOut>
                  <Link
                     to="/join"
                     className="group relative inline-flex h-7 items-center justify-center overflow-hidden flex-none
                           rounded-lg laptop:rounded-md px-2.5 font-medium text-indigo-600 transition duration-300 ease-out shadow-sm shadow-1"
                  >
                     <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                     <span
                        className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                              rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                     ></span>
                     <span className="relative text-xs laptop:text-[10px] font-bold text-white uppercase">
                        Sign up
                     </span>
                  </Link>
               </LoggedOut>
            </div>
         </div>
      </div>
   );
}
