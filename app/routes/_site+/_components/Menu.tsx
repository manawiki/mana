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

export const PinnedSideMenu = ({ site }: { site: Site }) => {
   return (
      <>
         {site?.pinned && site?.pinned?.length > 1 && (
            <>
               <div className="flex items-center text-xs text-1 pb-3 desktop:pb-2 pt-4 font-semibold px-4">
                  <div className="flex items-center w-full gap-1 max-desktop:justify-center">
                     <div className="flex-grow text-zinc-500 max-desktop:hidden">
                        Pinned
                     </div>
                     <Icon
                        name="pin"
                        className="desktop:hidden text-zinc-400 dark:text-zinc-500"
                        size={14}
                     />
                  </div>
               </div>
               <ul
                  className="desktop:pl-4 dark:divide-zinc-700/40 border-y border-zinc-200/40 
                  divide-zinc-200/40 dark:border-zinc-700/40 divide-y divide-color"
               >
                  {site.pinned?.map((item: any) => (
                     <li key={item.id}>
                        <PinnedMenuLink
                           item={item}
                           to={pinnedLinkUrlGenerator(item)}
                        />
                     </li>
                  ))}
               </ul>
            </>
         )}
      </>
   );
};

function PinnedMenuLink({ item, to }: { item: any; to: string }) {
   return (
      <NavLink
         prefetch="intent"
         className="flex items-center relative gap-3 py-3 text-1 desktop:pr-3.5 text-[13px] font-semibold max-desktop:justify-center"
         to={to}
      >
         {({ isActive, isPending }) => (
            <>
               {(isActive || isPending) && (
                  <div className="w-3 h-3 absolute -left-[22px] rounded-full dark:bg-zinc-600 bg-zinc-300" />
               )}
               <div className="truncate max-desktop:hidden flex-grow">
                  {item?.relation?.value?.name}
               </div>
               <div className="h-6 w-6 laptop:w-5 laptop:h-5 flex items-center justify-center">
                  {item.relation?.value?.icon?.url ? (
                     <Image
                        width={80}
                        height={80}
                        url={item.relation?.value?.icon?.url}
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt="Pinned Icon"
                     />
                  ) : (
                     <Icon
                        name="component"
                        className="text-1 mx-auto"
                        size={24}
                     />
                  )}
               </div>
            </>
         )}
      </NavLink>
   );
}

export const PinnedList = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange?: any;
}) => {
   return (
      site?.pinned &&
      site?.pinned?.length > 1 && (
         <>
            <div className="flex items-center gap-2 pb-2.5 pl-2 pt-5">
               <Icon
                  name="pin"
                  title="Pinned"
                  className="text-zinc-500"
                  size={14}
               />
               <span className="text-1 text-sm font-bold">Pinned</span>
            </div>
            <ul className="space-y-2">
               {site.pinned?.map((item: any) => (
                  <li key={item.id}>
                     <Link prefetch="intent" to={pinnedLinkUrlGenerator(item)}>
                        <div
                           onClick={() => onOpenChange(false)}
                           className="shadow-1 bg-3 border-color relative flex items-center gap-3
                          rounded-xl border p-3 text-sm font-bold shadow-sm"
                        >
                           <div className="h-5 w-5">
                              {item.relation?.value?.icon?.url ? (
                                 <Image
                                    width={80}
                                    height={80}
                                    url={item.relation?.value?.icon?.url}
                                    options="aspect_ratio=1:1&height=80&width=80"
                                    alt="Pinned Icon"
                                 />
                              ) : (
                                 <Icon
                                    name="component"
                                    className="text-1 mx-auto"
                                    size={24}
                                 />
                              )}
                           </div>
                           <div className="truncate">
                              {item.relation.value.name}
                           </div>
                        </div>
                     </Link>
                  </li>
               ))}
            </ul>
         </>
      )
   );
};

export const PrimaryMenuLinks = ({
   site,
   onOpenChange,
}: {
   site: Site;
   onOpenChange?: any;
}) => {
   return (
      <>
         <NavLink className="block mb-2" prefetch="intent" to="posts">
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-white dark:bg-bg3Dark border-color relative 
                  flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={() => onOpenChange(false)}
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
                  <span>Posts</span>
               </div>
            )}
         </NavLink>
         <NavLink className="block" prefetch="intent" to="/collections">
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-white dark:bg-bg3Dark border-color relative 
                  flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
                  onClick={() => onOpenChange(false)}
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
                  <span>Collections</span>
               </div>
            )}
         </NavLink>
      </>
   );
};
