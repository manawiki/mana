import type { Site } from "payload-types";
import { Link, useParams } from "@remix-run/react";
import { Logo } from "./Logo";
import { Image } from "./Image";

export const SiteNavLink = ({ site }: { site: Site }) => {
   const { siteId } = useParams();
   const isActive = siteId == site.slug ? true : false;

   return (
      <>
         <Link
            className="bg-2 shadow-1 shadow-1 rounded-full 
               transition duration-200 active:translate-y-0.5 
               max-laptop:hidden laptop:shadow-sm"
            to={`${
               site.type == "custom"
                  ? `https://mana.wiki/${site.slug}`
                  : `/${site.slug}`
            }`}
         >
            <>
               <div className="h-11 w-11 overflow-hidden rounded-full laptop:h-[50px] laptop:w-[50px]">
                  <Image
                     alt="Site Logo"
                     options="fit=crop,width=88,height=88,gravity=auto"
                     //@ts-ignore
                     url={site.icon?.url}
                  />
               </div>
            </>
         </Link>
         {isActive && (
            <span
               className="absolute -left-1 top-1.5 h-10 w-2.5 
                  rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
            ></span>
         )}
      </>
   );
};

export const HomeLink = () => {
   return (
      <Link to="/">
         <div
            className="bg-3 shadow-1 mx-auto flex h-12 w-12
            items-center justify-center rounded-full font-logo shadow-sm transition
            duration-300 active:translate-y-0.5 laptop:my-3
            laptop:h-14 laptop:w-14"
         >
            <Logo className="h-6 w-6 laptop:h-7 laptop:w-7" />
         </div>
      </Link>
   );
};
