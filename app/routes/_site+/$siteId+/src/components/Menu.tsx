import {
   Link,
   NavLink,
   useNavigation,
   useRouteLoaderData,
} from "@remix-run/react";
import clsx from "clsx";

import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";
import { LoggedIn } from "~/routes/_auth+/src/components";

import { pinnedLinkUrlGenerator } from "../utils/pinnedLinkUrlGenerator";

export const FollowingListMobile = ({
   setMenuOpen,
   site,
}: {
   setMenuOpen?: any;
   site?: Site;
}) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="flex-grow space-y-3">
                  {following?.map((item) => (
                     <NavLink
                        reloadDocument={true}
                        key={item.id}
                        onClick={() => setMenuOpen(false)}
                        className="shadow-1 bg-3 border-color relative flex w-full items-center justify-between gap-3 rounded-xl border pr-4 shadow-sm"
                        to={`/${item.slug}`}
                     >
                        {({ isActive }) => (
                           <>
                              <div className="flex w-full items-center gap-3 truncate p-2">
                                 <div className="h-7 w-7 flex-none ">
                                    <Image
                                       className="border-color overflow-hidden rounded-full border shadow-sm"
                                       width={32}
                                       height={32}
                                       alt="Site Logo"
                                       options="aspect_ratio=1:1&height=120&width=120"
                                       url={item.icon?.url}
                                    />
                                 </div>
                                 <div className="truncate text-sm font-bold">
                                    {item.name}
                                 </div>
                              </div>
                              {isActive && (
                                 <div className="h-2.5 w-2.5 flex-none rounded-full bg-blue-500" />
                              )}
                           </>
                        )}
                     </NavLink>
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
                           to={pinnedLinkUrlGenerator(item, site?.slug ?? "")}
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
   const navigation = useNavigation();

   //opportunistically update the active state of the link
   const opportunistic = (isActive: boolean, to: string) =>
      navigation?.state === "loading"
         ? navigation?.location?.pathname === to
         : isActive;

   return (
      <NavLink
         prefetch="intent"
         className="flex items-center relative gap-3 py-3 text-1 desktop:pr-3.5 text-[13px] font-semibold max-desktop:justify-center"
         to={to}
      >
         {({ isActive }) => (
            <>
               {opportunistic(isActive, to) && (
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
                     <Link
                        prefetch="intent"
                        to={pinnedLinkUrlGenerator(item, site?.slug ?? "")}
                     >
                        <div
                           onClick={() => onOpenChange(false)}
                           className="shadow-1 bg-3-sub border-color-sub relative flex items-center gap-3
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
         <NavLink
            className="block mb-2"
            prefetch="intent"
            to={`/${site.slug}/posts`}
         >
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-3-sub border-color-sub relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
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
         <NavLink
            className="block"
            prefetch="intent"
            to={`/${site.slug}/collections`}
         >
            {({ isActive }) => (
               <div
                  className="shadow-1 bg-3-sub border-color-sub relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
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
