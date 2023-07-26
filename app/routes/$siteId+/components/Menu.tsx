import type { Site, User } from "~/db/payload-types";
import { CircleStackIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link, NavLink, useRouteLoaderData } from "@remix-run/react";
import { Component, Pin } from "lucide-react";
import { Image } from "~/components";
import { pinnedLinkUrlGenerator } from "../utils";
import { Squares2X2Icon, UserIcon } from "@heroicons/react/24/solid";
import { LoggedIn } from "~/modules/auth";

export const activeStyle = `bg-white shadow-sm shadow-1 text-light dark:bg-bg3Dark dark:text-dark`;
export const defaultStyle = `bg-2 hover:bg-white flex items-center gap-2.5 rounded-full font-bold dark:hover:bg-bg3Dark bg-2 text-1 rounded-lg text-sm px-2.5 py-2`;

export const FollowingListMobile = ({ setMenuOpen }: { setMenuOpen?: any }) => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];

   return (
      <>
         <LoggedIn>
            {following?.length === 0 ? null : (
               <div className="flex-grow space-y-3">
                  {following?.map((item) => (
                     <NavLink
                        reloadDocument={
                           // Reload if custom site, but NOT if current site is custom
                           item.type == "custom" && true
                        }
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
               <div className="space-y-0.5 pl-3 pt-6">
                  <div className="flex items-center gap-2.5 pb-2 pl-2.5">
                     <div className="text-1 flex items-center gap-3.5 text-sm font-bold">
                        <Pin className="text-red-400" size={16} />
                        <span>Pinned</span>
                     </div>
                     <div className="block h-0.5 flex-grow rounded-l-full bg-zinc-100 dark:bg-bg3Dark" />
                  </div>
                  <ul className="space-y-0.5 pr-3">
                     {site.pinned?.map((item: any) => (
                        <li key={item.id}>
                           <NavLink
                              prefetch="intent"
                              className={({ isActive }) =>
                                 `${
                                    isActive ? activeStyle : ""
                                 } ${defaultStyle} relative font-normal`
                              }
                              to={pinnedLinkUrlGenerator(
                                 item,
                                 site?.slug ?? ""
                              )}
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
                                    <Component
                                       className="text-1 mx-auto"
                                       size={24}
                                    />
                                 )}
                              </div>
                              <div className="truncate">
                                 {item.relation.value.name}
                              </div>
                           </NavLink>
                        </li>
                     ))}
                  </ul>
               </div>
               <div className="ml-6 mt-3 block h-0.5 rounded-l-full bg-zinc-100 dark:bg-bg3Dark" />
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
               <Pin className="text-red-400" size={14} />
               <span className="text-1 text-sm font-bold">Pinned</span>
            </div>
            <ul className="space-y-2">
               {site.pinned?.map((item: any) => (
                  <li key={item.id}>
                     <Link
                        onClick={() => onOpenChange(false)}
                        className="shadow-1 bg-3 border-color relative flex items-center gap-3
                          rounded-xl border p-3 pr-4 text-sm font-bold shadow-sm"
                        prefetch="intent"
                        to={pinnedLinkUrlGenerator(item, site?.slug ?? "")}
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
                              <Component className="text-1 mx-auto" size={24} />
                           )}
                        </div>
                        <div className="truncate">
                           {item.relation.value.name}
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
      <div className="grid grid-cols-2 gap-3">
         <Link
            onClick={() => onOpenChange(false)}
            className="shadow-1 bg-3 border-color relative flex items-center gap-3 rounded-xl border p-3 pr-4 text-sm font-bold shadow-sm"
            prefetch="intent"
            to={`/${site.slug}/posts`}
         >
            <PencilSquareIcon className="h-[17px] w-[17px] text-emerald-500" />
            <span>Posts</span>
         </Link>
         <Link
            onClick={() => onOpenChange(false)}
            className="shadow-1 bg-3 border-color relative flex items-center gap-3 rounded-xl border p-3 pr-4 text-sm font-bold shadow-sm"
            prefetch="intent"
            to={`/${site.slug}/collections`}
         >
            <CircleStackIcon className="h-[17px] w-[17px] text-yellow-500" />
            <span>Collections</span>
         </Link>
      </div>
   );
};

export const MobileNav = ({
   isIOS,
   safeArea,
   isMobileApp,
   setFollowerMenuOpen,
   setUserMenuOpen,
}: {
   safeArea: any;
   isIOS: Boolean;
   isMobileApp: Boolean;
   setFollowerMenuOpen: any;
   setUserMenuOpen: any;
}) => {
   return (
      <>
         {isMobileApp && (
            <nav
               style={{
                  paddingBottom: (isIOS && safeArea?.bottom) ?? "",
               }}
               className="border-color fixed inset-x-0 bottom-0 z-50 w-full border-t border-gray-100
                        bg-white/90 backdrop-blur-lg dark:bg-bg3Dark/80"
            >
               <div className="grid grid-cols-2 gap-2">
                  <button
                     className="group touch-manipulation space-y-1 p-3"
                     onClick={() => setFollowerMenuOpen(true)}
                  >
                     <Squares2X2Icon
                        className="mx-auto h-6 w-6 text-blue-500 transition duration-300 group-active:translate-y-0.5"
                        aria-hidden="true"
                     />
                     <div className="text-center text-[9px] font-bold">
                        Following
                     </div>
                  </button>
                  <button
                     className="group touch-manipulation space-y-1 p-3"
                     onClick={() => setUserMenuOpen(true)}
                  >
                     <UserIcon
                        className="mx-auto h-6 w-6 text-blue-500 transition duration-300 group-active:translate-y-0.5"
                        aria-hidden="true"
                     />
                     <div className="text-center text-[9px] font-bold">
                        User
                     </div>
                  </button>
               </div>
            </nav>
         )}
      </>
   );
};

// const followersUrl = `${url}/api/users?depth=0&where[sites][equals]=${site.id}`;

// (await (
//    await fetch(followersUrl, {
//       headers: {
//          cookie: request.headers.get("cookie") ?? "",
//       },
//    })
// ).json()) as PaginatedDocs,
