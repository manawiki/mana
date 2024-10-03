import type { SerializeFrom } from "@remix-run/server-runtime";

import { AvatarButton } from "~/components/Avatar";
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
         <AvatarButton
            href={
               process.env.NODE_ENV == "development"
                  ? "/"
                  : `https://${sitePath}`
            }
            src={site?.icon?.url}
            initials={site?.name?.charAt(0)}
            alt="Site Logo"
            options="aspect_ratio=1:1&height=120&width=120"
            className="size-11 transition duration-300 active:translate-y-0.5"
         />
         {(isActive || isLoggedOut) && (
            <span className="absolute -left-1 top-1.5 h-7 w-2.5 rounded-lg bg-zinc-600 dark:bg-zinc-300 max-laptop:hidden" />
         )}
      </>
   );
}
