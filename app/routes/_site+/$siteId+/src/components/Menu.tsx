import { Link, NavLink, useRouteLoaderData } from "@remix-run/react";
import clsx from "clsx";

import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import type { Site, User } from "~/db/payload-types";
import { LoggedIn } from "~/routes/_auth+/src/components";

import { pinnedLinkUrlGenerator } from "../utils/pinnedLinkUrlGenerator";

export const activeStyle = `bg-zinc-200/40 dark:bg-bg3Dark`;
export const defaultStyle = `bg-2 hover:bg-zinc-100 flex items-center gap-3 rounded-full font-bold dark:hover:bg-bg3Dark/70 bg-2 text-1 rounded-lg text-sm px-2.5 py-2`;

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
               <div className="space-y-0.5 pt-6 desktop:pl-3">
                  <div className="flex items-center gap-1.5 pb-2 desktop:gap-3.5 desktop:pl-2.5">
                     <div className="block h-0.5 flex-grow rounded-l-full bg-zinc-100 dark:bg-bg3Dark desktop:hidden" />
                     <div className="text-1 flex items-center gap-3.5 text-sm font-bold">
                        <Icon
                           name="pin"
                           title="Pinned"
                           className="text-zinc-500"
                           size={16}
                        />
                        {/* <span className="max-desktop:hidden">Pinned</span> */}
                     </div>
                     <div className="block h-0.5 flex-grow rounded-l-full bg-zinc-100 dark:bg-bg3Dark" />
                  </div>
                  <ul className="space-y-0.5 max-desktop:mx-3 desktop:pr-3">
                     {site.pinned?.map((item: any) => (
                        <li key={item.id}>
                           <NavLink
                              prefetch="intent"
                              className={({ isActive }) =>
                                 clsx(
                                    isActive ? activeStyle : "",
                                    `${defaultStyle} !p-2 text-sm font-semibold`,
                                 )
                              }
                              to={pinnedLinkUrlGenerator(
                                 item,
                                 site?.slug ?? "",
                              )}
                           >
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
                              <div className="truncate max-desktop:hidden">
                                 {item.relation.value.name}
                              </div>
                           </NavLink>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="mt-3 block h-0.5 rounded-l-full bg-zinc-100 dark:bg-bg3Dark desktop:ml-6" />
            </>
         )}
      </>
   );
};

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
                           className="shadow-1 bg-3 border-color relative flex items-center gap-3
                          rounded-xl border p-3 pr-4 text-sm font-bold shadow-sm"
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
                  className="shadow-1 bg-3 border-color relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
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
                  >
                     Posts
                  </Icon>
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
                  className="shadow-1 bg-3 border-color relative flex items-center gap-3.5 rounded-xl border p-3 text-sm font-bold shadow-sm"
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
                  >
                     Collections
                  </Icon>
               </div>
            )}
         </NavLink>
      </>
   );
};
