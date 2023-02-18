import type { Site } from "payload-types";
import { Link, useParams, useRouteLoaderData } from "@remix-run/react";
import { Logo } from "./Logo";
import type { envType } from "env/types";
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

   const SiteLink = ({ url }: { url: string }) => {
      return (
         <>
            <Link
               className="bg-2 rounded-full border shadow-zinc-300 transition 
               duration-200 active:translate-y-0.5  
               dark:border-zinc-700 dark:shadow-black laptop:shadow-lg"
               to={url}
            >
               <>
                  <div className="h-11 w-11 overflow-hidden rounded-full laptop:h-[50px] laptop:w-[50px]">
                     <Image
                        alt="Site Logo"
                        options="fit=crop,width=70,height=70,gravity=auto"
                        //@ts-ignore
                        url={site.icon?.url}
                     />
                  </div>
               </>
            </Link>
            {isActive && (
               <span
                  className="absolute top-1.5 -left-1 h-10 w-2.5 
                  rounded-lg bg-zinc-500 dark:bg-zinc-200 max-laptop:hidden"
               ></span>
            )}
         </>
      );
   };

   if (
      env != "local" &&
      site?.type == "custom" &&
      site?.subdomain !== "undefined"
   )
      return (
         <SiteLink url={`https://${site.subdomain}.${domain}/${site.id}`} />
      );
   if (
      env != "local" &&
      currentSite?.type == "custom" &&
      currentSite?.subdomain !== "undefined"
   )
      return <SiteLink url={`https://${domain}/${site.id}`} />;
   if (env == "local") {
      return <SiteLink url={`/${site.id}`} />;
   }
   return <SiteLink url={`/${site.id}`} />;
};

export const HomeLink = ({ site }: { site: Site }) => {
   const { env } = useRouteLoaderData("root") as { env: envType };
   const style = `flex h-12 w-12 items-center justify-center rounded-full border-2
   transition duration-300 font-logo bg-2
   active:translate-y-0.5 dark:border-zinc-700 dark:shadow-black
 dark:hover:bg-zinc-800 dark:focus:bg-zinc-600 laptop:h-14 laptop:w-14`;

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
            <div className={style}>
               <Logo
                  width={34}
                  height={34}
                  options="width=50,height=50"
                  className="max-laptop:h-7 max-laptop:w-7"
               />
            </div>
         </a>
      );
   return (
      <Link
         to="/home"
         className="border-color flex items-center justify-center laptop:p-3 laptop:pb-4"
      >
         <div className={style}>
            <Logo
               width={34}
               height={34}
               options="width=50,height=50"
               className="max-laptop:h-7 max-laptop:w-7"
            />
         </div>
      </Link>
   );
};
