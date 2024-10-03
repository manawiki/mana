import type { SerializeFrom } from "@remix-run/server-runtime";

import { AvatarButton } from "~/components/Avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/Tooltip";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export function SidebarItem({
   site,
   siteSlug,
   isLoggedOut,
}: {
   site: SerializeFrom<typeof siteLoaderType>["site"] | any;
   siteSlug?: string;
   isLoggedOut?: boolean;
}) {
   const sitePath = site.domain ? site.domain : `${site.slug}.mana.wiki`;
   const isActive = siteSlug === site.slug;

   return (
      <>
         <Tooltip key={site.slug} placement="right">
            <TooltipTrigger asChild>
               <div>
                  <AvatarButton
                     href={
                        process.env.NODE_ENV == "development"
                           ? "/"
                           : `https://${sitePath}`
                     }
                     src={site?.icon?.url}
                     initials={site?.name?.charAt(0)}
                     alt="Site Logo"
                     square={isActive}
                     options="aspect_ratio=1:1&height=120&width=120"
                     className="size-11 transition duration-300 block active:translate-y-0.5 shadow-sm shadow-1"
                  />
                  {(isActive || isLoggedOut) && (
                     <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-300 max-laptop:hidden" />
                  )}
               </div>
            </TooltipTrigger>
            <TooltipContent>
               <div className="text-sm font-semibold p-0.5">{site.name}</div>
            </TooltipContent>
         </Tooltip>
      </>
   );
}
