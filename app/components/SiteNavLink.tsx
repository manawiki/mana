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
               className="bg-2 rounded-full shadow-1 transition 
               duration-200 active:translate-y-0.5 max-laptop:hidden 
               laptop:shadow-sm shadow-1"
               to={url}
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
                  className="absolute top-1.5 -left-1 h-10 w-2.5 
                  rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
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
   const style = `flex h-12 w-12 items-center justify-center rounded-full
   transition duration-300 font-logo bg-3 mx-auto laptop:my-3
   active:translate-y-0.5 shadow-1 shadow-sm
   laptop:h-14 laptop:w-14`;

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
         <a href={domain}>
            <div className={style}>
               <Logo className="w-6 h-6 laptop:h-7 laptop:w-7" />
            </div>
         </a>
      );
   return (
      <Link to="/home">
         <div className={style}>
            <Logo className="w-6 h-6 laptop:h-7 laptop:w-7" />
         </div>
      </Link>
   );
};
