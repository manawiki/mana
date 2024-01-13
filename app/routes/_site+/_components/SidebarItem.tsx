import type { SerializeFrom } from "@remix-run/server-runtime";

import { Image } from "~/components/Image";
import { LogoBW } from "~/components/Logo";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export function SidebarItem({
   site,
   siteSlug,
   className,
}: {
   site: SerializeFrom<typeof siteLoaderType>["site"];
   siteSlug?: string;
   className?: string;
}) {
   const sitePath = site.domain ? site.domain : `${site.slug}.mana.wiki`;
   const isActive = siteSlug === site.slug;

   return (
      <a href={`https://${sitePath}`}>
         <>
            {site?.icon?.url ? (
               <Image
                  className="size-11 rounded-full overflow-hidden"
                  alt="Site Logo"
                  options="aspect_ratio=1:1&height=120&width=120"
                  url={site?.icon?.url ?? ""}
               />
            ) : (
               <div
                  className="size-[47px] dark:bg-dark400 border border-zinc-300/80 hover:border-zinc-300 
               dark:border-zinc-600 dark:hover:border-zinc-600 rounded-full overflow-hidden flex items-center justify-center"
               >
                  <LogoBW className="size-6 text-stone-400 dark:text-zinc-400" />
               </div>
            )}
            {isActive && (
               <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden" />
            )}
         </>
      </a>
   );
}
