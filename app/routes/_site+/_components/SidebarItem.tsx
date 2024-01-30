import type { SerializeFrom } from "@remix-run/server-runtime";

import { Image } from "~/components/Image";
import { LogoBW } from "~/components/Logo";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export function SidebarItem({
   site,
   siteSlug,
   className,
   isLoggedOut,
}: {
   site: SerializeFrom<typeof siteLoaderType>["site"] | any;
   siteSlug?: string;
   className?: string;
   isLoggedOut?: boolean;
}) {
   const sitePath = site.domain ? site.domain : `${site.slug}.mana.wiki`;
   const isActive = siteSlug === site.slug;

   return (
      <a href={`https://${sitePath}`}>
         <>
            {site?.icon?.url ? (
               <Image
                  className="size-11 rounded-full overflow-hidden dark:shadow-zinc-900
                  border border-zinc-200 shadow-sm shadow-zinc-300  dark:border-zinc-500"
                  alt="Site Logo"
                  options="aspect_ratio=1:1&height=120&width=120"
                  url={site?.icon?.url ?? ""}
               />
            ) : (
               <div
                  className="size-[46px] dark:bg-dark400 border border-zinc-300/70
                   bg-white shadow shadow-zinc-200 dark:shadow-zinc-900
                dark:border-zinc-600 rounded-full 
                  overflow-hidden flex items-center justify-center"
               >
                  <LogoBW className="size-6 text-stone-400 dark:text-zinc-400" />
               </div>
            )}
            {(isActive || isLoggedOut) && (
               <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden" />
            )}
         </>
      </a>
   );
}
