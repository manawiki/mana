import type { Site } from "@mana/db";
import { Link, NavLink, useParams, useRouteLoaderData } from "@remix-run/react";
import { Logo } from "./Logo";
import type { envType } from "@mana/shared";
import { Image } from "./Image";

export const SiteNavLink = ({
   site,
   currentSite,
}: {
   site: Site;
   currentSite: Site;
}) => {
   const { siteId } = useParams();
   const isActive = siteId == site.id ? true : false;
   const { env } = useRouteLoaderData("root") as { env: envType };
   const domain = env == "dev-server" ? "manatee.wiki" : "mana.wiki";
   const defaultStyle = `flex h-14 w-14 items-center justify-center 
   overflow-hidden rounded-full border-2 bg-zinc-300 transition 
   duration-500 hover:border-blue-300 focus:border-blue-400 dark:border-zinc-700
   dark:bg-zinc-700 dark:hover:border-blue-600 dark:focus:border-blue-500`;
   const style = `${
      isActive && "border-blue-400 dark:!border-blue-500"
   } ${defaultStyle}`;
   if (
      env != "local" &&
      site?.type == "custom" &&
      site?.subdomain !== "undefined"
   )
      return (
         <a
            className={style}
            href={`https://${site.subdomain}.${domain}/${site.id}`}
         >
            <div className="overflow-hidden rounded-full border-4 border-zinc-50 dark:border-zinc-900">
               <Image
                  alt="Site Logo"
                  options="fit=crop,width=60,height=60,gravity=auto"
                  //@ts-ignore
                  url={site.icon?.url}
               />
            </div>
         </a>
      );
   if (
      env != "local" &&
      currentSite?.type == "custom" &&
      currentSite?.subdomain !== "undefined"
   )
      return (
         <a href={`https://${domain}/${site.id}`} className={style}>
            <div className="overflow-hidden rounded-full border-4 border-zinc-50 dark:border-zinc-900">
               <Image
                  alt="Site Logo"
                  options="fit=crop,width=60,height=60,gravity=auto"
                  //@ts-ignore
                  url={site.icon?.url}
               />
            </div>
         </a>
      );
   if (env == "local") {
      return (
         <NavLink
            to={`/${site.id}`}
            className={({ isActive }) =>
               `${
                  isActive && "border-blue-400 dark:!border-blue-500"
               } ${defaultStyle}`
            }
         >
            <div className="overflow-hidden rounded-full border-4 border-zinc-50 dark:border-zinc-900">
               <Image
                  alt="Site Logo"
                  options="fit=crop,width=60,height=60,gravity=auto"
                  //@ts-ignore
                  url={site.icon?.url}
               />
            </div>
         </NavLink>
      );
   }
   return (
      <NavLink
         to={`/${site.id}`}
         className={({ isActive }) =>
            `${
               isActive && "border-blue-400 dark:!border-blue-500"
            } ${defaultStyle}`
         }
      >
         <div className="overflow-hidden rounded-full border-4 border-zinc-50 dark:border-zinc-900">
            <Image
               alt="Site Logo"
               options="fit=crop,width=60,height=60,gravity=auto"
               //@ts-ignore
               url={site.icon?.url}
            />
         </div>
      </NavLink>
   );
};

export const HomeLink = ({ site }: { site: Site }) => {
   const { env } = useRouteLoaderData("root") as { env: envType };
   const domain =
      env == "dev-server"
         ? "https://manatee.wiki/home"
         : "https://mana.wiki/home";

   if (
      env != "local" &&
      site?.type == "custom" &&
      site?.subdomain !== "undefined"
   )
      return (
         <a
            href={domain}
            className="border-color flex items-center justify-center laptop:p-3 laptop:pb-4"
         >
            <div
               className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow
               shadow-zinc-300 transition duration-300 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black
               dark:hover:bg-zinc-800 dark:focus:bg-zinc-600 laptop:h-14 laptop:w-14"
            >
               <Logo
                  options="width=24,height=24"
                  className="max-laptop:w-5 max-laptop:h-5"
               />
            </div>
         </a>
      );
   return (
      <Link
         to="/home"
         className="border-color flex items-center justify-center laptop:p-3 laptop:pb-4"
      >
         <div
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow
             shadow-zinc-300 transition duration-300 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black
           dark:hover:bg-zinc-800 dark:focus:bg-zinc-600 laptop:h-14 laptop:w-14"
         >
            <Logo
               options="width=24,height=24"
               className="max-laptop:w-5 max-laptop:h-5"
            />
         </div>
      </Link>
   );
};
