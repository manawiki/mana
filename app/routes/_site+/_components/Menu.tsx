import { Link, NavLink } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import type { Site } from "~/db/payload-types";
import { LoggedIn } from "~/routes/_auth+/components/LoggedIn";
import { pinnedLinkUrlGenerator } from "~/utils/pinnedLinkUrlGenerator";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";

import { SidebarItem } from "./SidebarItem";

export const FollowingListMobile = ({ setMenuOpen }: { setMenuOpen?: any }) => {
   const { following } = useRootLoaderData();

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="grid justify-items-center grid-cols-5 mobile:grid-cols-5 tablet:grid-cols-9 laptop:grid-cols-10 gap-4">
                  {following?.map((item) => (
                     <SidebarItem key={item.slug} site={item} />
                  ))}
               </div>
            )}
         </LoggedIn>
      </>
   );
};

export const PrimaryMenuLinks = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
   return (
      <>
         <NavLink className="block mb-2" prefetch="intent" to="posts">
            {({ isActive }) => (
               <div
                  className="dark:shadow-zinc-800 bg-white dark:bg-dark350 border-color-sub relative 
                  flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={onOpenChange ? () => onOpenChange(false) : undefined}
               >
                  <Icon
                     name="pen-square"
                     size={15}
                     className={clsx(
                        isActive
                           ? "dark:text-zinc-400 text-zinc-500"
                           : "text-zinc-400 dark:text-zinc-500",
                        "desktop:mr-1",
                     )}
                  />
                  <span className="flex-grow">Posts</span>
                  <Icon name="chevron-right" size={15} />
               </div>
            )}
         </NavLink>
         <NavLink className="block" prefetch="intent" to="/collections">
            {({ isActive }) => (
               <div
                  className="dark:shadow-zinc-800 bg-white dark:bg-dark350 border-color-sub relative 
                  flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={onOpenChange ? () => onOpenChange(false) : undefined}
               >
                  <Icon
                     name="database"
                     title="collections"
                     size={15}
                     className={clsx(
                        isActive
                           ? "dark:text-zinc-400 text-zinc-500"
                           : "text-zinc-400 dark:text-zinc-500",
                        "desktop:mr-1",
                     )}
                  />
                  <span className="flex-grow">Collections</span>
                  <Icon name="chevron-right" size={15} />
               </div>
            )}
         </NavLink>
      </>
   );
};
