import type { SerializeFrom } from "@remix-run/server-runtime";

import { Image } from "~/components/Image";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

export function SidebarItem({
   site,
   siteSlug,
}: {
   site: SerializeFrom<typeof siteLoaderType>["site"];
   siteSlug?: string;
}) {
   const sitePath = site.domain ? site.domain : `${site.slug}.mana.wiki`;
   const isActive = siteSlug === site.slug;

   return (
      <a
         className="bg-2 shadow-1 rounded-full shadow"
         href={`https://${sitePath}`}
      >
         <>
            <div className="h-8 w-8 overflow-hidden rounded-full laptop:h-11 laptop:w-11">
               <Image
                  alt="Site Logo"
                  options="aspect_ratio=1:1&height=120&width=120"
                  url={site?.icon?.url ?? ""}
               />
            </div>
            {isActive && (
               <span className="absolute -left-1 top-2 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden" />
            )}
         </>
      </a>
   );
}
