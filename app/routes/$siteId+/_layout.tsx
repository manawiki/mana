import {
   Await,
   Form,
   Link,
   NavLink,
   Outlet,
   useFetcher,
   useLoaderData,
   useLocation,
   useRouteLoaderData,
} from "@remix-run/react";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import {
   Bookmark,
   ChevronDown,
   ChevronLeft,
   Component,
   Dog,
   HardDrive,
   Loader2,
   Lock,
   LogOut,
   MenuIcon,
   Pin,
   Search,
   Settings2,
   User as UserLucideIcon,
   Users,
   X,
} from "lucide-react";
import type {
   ActionFunction,
   LinksFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { zx } from "zodix";
import { z } from "zod";
import { assertIsPost, isAdding, isNativeSSR } from "~/utils";
import {
   AdminOrStaffOrOwner,
   FollowingSite,
   LoggedIn,
   LoggedOut,
   LoggedOutDropDown,
   NotFollowingSite,
} from "~/modules/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/Image";
import {
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
   Squares2X2Icon,
   UserIcon,
} from "@heroicons/react/24/outline";
import {
   HomeIcon as HomeIconBold,
   PencilSquareIcon as PencilSquareIconBold,
   CircleStackIcon as CircleStackIconBold,
} from "@heroicons/react/24/solid";
import { NewSiteModal } from "~/routes/action+/new-site-modal";
import type { Site, Update, User, CoreMeta } from "payload/generated-types";
import { DotLoader, Modal } from "~/components";
import Tooltip from "~/components/Tooltip";
import * as gtag from "~/routes/$siteId+/utils/gtags.client";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import SearchComboBox from "./resource+/Search";
import { deferIf } from "defer-if";
import clsx from "clsx";
import { SafeArea } from "capacitor-plugin-safe-area";
import { SplashScreen } from "@capacitor/splash-screen";

import { useIsBot } from "~/utils/isBotProvider";
import { fetchWithCache } from "~/utils/cache.server";
import { settings } from "mana-config";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const { isMobileApp } = isNativeSSR(request);

   const siteUrl = `${settings.domainFull}/api/sites?where[slug][equals]=${siteId}&depth=2`;

   const { docs: slug } = (await fetchWithCache(siteUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   })) as PaginatedDocs<Site>;

   const site = slug[0];

   const updatesUrl = `${settings.domainFull}/api/updates?where[site.slug][equals]=${siteId}&depth=0&sort=-createdAt`;

   const { docs: updateResults } = (await fetchWithCache(updatesUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   })) as PaginatedDocs<Update>;
   return await deferIf({ updateResults, site }, isMobileApp, {
      init: {
         headers: { "Cache-Control": "public, s-maxage=60, max-age=60" },
      },
   });
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: data.site.name,
      },
   ];
};

export const handle = {
   i18n: "site",
};

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>() || {};
   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);
   const location = useLocation();

   const isSiteHome = location.pathname == `/${site.slug}`;

   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];

   const [isMenuOpen, setMenuOpen] = useState(false);
   const [isMainMenuOpen, setMainMenuOpen] = useState(false);
   const [isUserMenuOpen, setUserMenuOpen] = useState(false);

   const gaTrackingId = site?.gaTagId;
   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTrackingId) {
         gtag.pageview(location.pathname, gaTrackingId);
      }
      setSearchToggle(false);
   }, [location, gaTrackingId]);

   const [searchToggle, setSearchToggle] = useState(false);
   let isBot = useIsBot();

   const { isMobileApp, coreMeta, isIOS } = useRouteLoaderData("root") as {
      isMobileApp: Boolean;
      coreMeta: CoreMeta;
      isIOS: Boolean;
   };

   //On native mobile, get the safe area padding
   const [safeArea, setSetArea] = useState() as any;

   useEffect(() => {
      if (isMobileApp) {
         SafeArea.getSafeAreaInsets().then(({ insets }) => {
            setSetArea(insets);
         });
         SplashScreen.hide();
      }
   }, []);

   const bottomSafeArea = isMobileApp
      ? safeArea?.bottom
         ? safeArea?.bottom + 60
         : 60
      : 0;

   const topSafeArea = isMobileApp ? (safeArea?.top ? safeArea?.top : 0) : 0;

   //Prevent layout shift on native. Don't paint screen yet.
   if (isMobileApp && !safeArea)
      return (
         <div className="bg-3 flex min-h-[100vh] min-w-full items-center justify-start">
            <DotLoader />
         </div>
      );

   return (
      <Suspense fallback="Loading...">
         <Await resolve={{ site }}>
            {({ site }) => (
               <div>
                  {!isMobileApp && (
                     <header
                        className="bg-2 border-color shadow-1 fixed top-0 z-50 flex 
                        h-14 w-full items-center justify-between border-b px-3 laptop:shadow-sm"
                     >
                        <div className="z-10 flex items-center gap-3">
                           <div className="laptop:hidden">
                              {/* Following menu modal */}
                              <LoggedIn>
                                 <div className="flex items-center gap-3">
                                    <NotFollowingSite>
                                       <div className="flex items-center">
                                          <fetcher.Form
                                             className="w-full"
                                             method="post"
                                          >
                                             <button
                                                name="intent"
                                                value="followSite"
                                                className="flex h-8 items-center justify-center rounded-full bg-black
                                                px-3.5 text-sm font-bold text-white dark:bg-white dark:text-black"
                                             >
                                                {adding ? (
                                                   <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                                ) : (
                                                   t("follow.actionFollow")
                                                )}
                                             </button>
                                          </fetcher.Form>
                                       </div>
                                    </NotFollowingSite>
                                    <button
                                       className="bg-3 shadow-1 border-color flex items-center justify-center
                                       gap-2 rounded-full border p-1.5 pl-3   text-sm font-bold shadow-sm"
                                       onClick={() => setMenuOpen(true)}
                                    >
                                       <div className="pr-2 text-xs">
                                          My Follows
                                       </div>
                                       <div className="bg-1 flex h-5 w-5 items-center justify-center rounded-full">
                                          <ChevronDown
                                             className="dark:text-white"
                                             size={14}
                                          />
                                       </div>
                                    </button>
                                 </div>
                              </LoggedIn>
                           </div>
                        </div>
                        <LoggedOutDropDown />
                        <LoggedOut>
                           <Link
                              prefetch="intent"
                              reloadDocument={site.type != "custom" && true}
                              to={`/login?redirectTo=/${site.slug}`}
                              className="shadow-1 z-20 flex h-8 items-center justify-center rounded-full bg-zinc-700 px-3.5 text-sm
                              font-bold text-white shadow-sm dark:bg-white dark:text-black laptop:hidden"
                           >
                              Follow
                           </Link>

                           <div className="relative z-10 flex w-full items-center justify-end gap-3">
                              <DarkModeToggle />
                              <Link
                                 prefetch="intent"
                                 reloadDocument={site.type != "custom" && true}
                                 to="/join"
                                 className="shadow-1 group relative inline-flex h-8 items-center justify-center overflow-hidden 
                                 rounded-lg px-3 py-2 font-medium text-indigo-600 shadow shadow-zinc-400 transition duration-300 ease-out"
                              >
                                 <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                                 <span
                                    className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                                    rotate-45 transform rounded-lg bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                                 ></span>
                                 <span className="relative text-xs font-bold uppercase text-white">
                                    {t("login.signUp", { ns: "auth" })}
                                 </span>
                              </Link>
                              <Link
                                 prefetch="intent"
                                 reloadDocument={site.type != "custom" && true}
                                 className="border-color bg-3 shadow-1 flex h-8 items-center
                                 justify-center rounded-lg border px-3 text-center
                                 text-xs font-bold uppercase shadow-sm shadow-zinc-300"
                                 to={`/login?redirectTo=${location.pathname}`}
                              >
                                 {t("login.action", { ns: "auth" })}
                              </Link>
                           </div>
                        </LoggedOut>
                        <div
                           className="pattern-opacity-50 pattern-dots absolute left-0 top-0
                           h-full w-full pattern-bg-white pattern-zinc-300 
                           pattern-size-2 dark:pattern-bg-bg1Dark dark:pattern-bg4Dark"
                        />
                     </header>
                  )}
                  <div className="laptop:grid laptop:min-h-screen laptop:auto-cols-[82px_0px_1fr_334px] laptop:grid-flow-col desktop:auto-cols-[82px_220px_1fr_334px]">
                     {/* ==== Left Sidebar ==== */}
                     <section
                        className="bg-1 border-color relative top-0 z-50
                        max-laptop:fixed max-laptop:w-full laptop:border-r"
                     >
                        <div
                           className="top-0 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
                           laptop:h-full laptop:w-[82px] laptop:overflow-y-auto laptop:pt-4"
                        >
                           <LoggedOut>
                              <div className="relative flex items-center justify-center pb-3">
                                 <NavLink
                                    prefetch="intent"
                                    className="bg-2 shadow-1 rounded-full shadow"
                                    to={`/${site.slug}`}
                                 >
                                    {({ isActive }) => (
                                       <>
                                          <div
                                             className="h-8 w-8 overflow-hidden 
                                    rounded-full laptop:h-[50px] laptop:w-[50px]"
                                          >
                                             <Image
                                                alt="Site Logo"
                                                options="aspect_ratio=1:1&height=120&width=120"
                                                url={site.icon?.url}
                                             />
                                          </div>
                                          {isActive && (
                                             <span
                                                className="absolute -left-1 top-2 h-9 w-2.5 
                                    rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
                                             />
                                          )}
                                       </>
                                    )}
                                 </NavLink>
                              </div>
                           </LoggedOut>
                           <menu className="w-full justify-between max-laptop:flex max-laptop:gap-3">
                              <LoggedIn>
                                 {following?.length === 0 ? (
                                    <div className="relative flex items-center justify-center pb-3">
                                       <NavLink
                                          prefetch="intent"
                                          className="bg-2 shadow-1 rounded-full shadow"
                                          to={`/${site.slug}`}
                                       >
                                          {({ isActive }) => (
                                             <>
                                                <div
                                                   className="h-8 w-8 overflow-hidden 
                                    rounded-full laptop:h-[50px] laptop:w-[50px]"
                                                >
                                                   <Image
                                                      alt="Site Logo"
                                                      options="aspect_ratio=1:1&height=120&width=120"
                                                      url={site.icon?.url}
                                                   />
                                                </div>
                                                {isActive && (
                                                   <span
                                                      className="absolute -left-1 top-2 h-9 w-2.5 
                                    rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
                                                   />
                                                )}
                                             </>
                                          )}
                                       </NavLink>
                                    </div>
                                 ) : (
                                    <div className="w-full max-laptop:flex max-laptop:items-center max-laptop:gap-3">
                                       <ul
                                          className="text-center max-laptop:flex max-laptop:flex-grow
                                          max-laptop:gap-3 laptop:mb-4 laptop:space-y-3"
                                       >
                                          {following?.map((item) => (
                                             <li key={item.id}>
                                                <div className="relative flex items-center justify-center">
                                                   <NavLink
                                                      prefetch="intent"
                                                      reloadDocument={
                                                         // Reload if custom site, but NOT if current site is custom
                                                         item.type ==
                                                            "custom" &&
                                                         site.type !=
                                                            "custom" &&
                                                         true
                                                      }
                                                      className="bg-2 shadow-1 rounded-full shadow"
                                                      to={`/${item.slug}`}
                                                   >
                                                      {({ isActive }) => (
                                                         <>
                                                            <div
                                                               className="h-8 w-8 overflow-hidden 
                                                               rounded-full laptop:h-[50px] laptop:w-[50px]"
                                                            >
                                                               <Image
                                                                  alt="Site Logo"
                                                                  options="aspect_ratio=1:1&height=120&width=120"
                                                                  url={
                                                                     item.icon
                                                                        ?.url
                                                                  }
                                                               />
                                                            </div>
                                                            {isActive && (
                                                               <span
                                                                  className="absolute -left-1 top-2 h-9 w-2.5 
                                                                  rounded-lg bg-zinc-600 dark:bg-zinc-400 max-laptop:hidden"
                                                               />
                                                            )}
                                                         </>
                                                      )}
                                                   </NavLink>
                                                </div>
                                             </li>
                                          ))}
                                       </ul>
                                       <NewSiteModal />
                                    </div>
                                 )}
                              </LoggedIn>
                              <LoggedOut>
                                 <div className="items-center justify-center">
                                    <NewSiteModal />
                                 </div>
                              </LoggedOut>
                           </menu>
                        </div>
                     </section>
                     {/* ==== Main Section ==== */}
                     <section>
                        <div className="bg-1 bg-2 border-color shadow-1 fixed bottom-0 top-0 z-50 mx-auto hidden h-full w-[220px] overflow-y-auto border-r py-4 shadow-sm desktop:block">
                           <SideMenu site={site} user={user} />
                        </div>
                     </section>
                     <section className="max-laptop:border-color bg-3 max-laptop:border-b">
                        <section
                           className={clsx(
                              isMobileApp
                                 ? "sticky top-0 w-full "
                                 : "sticky max-laptop:top-[56px] laptop:top-6",
                              "z-40 laptop:z-50"
                           )}
                        >
                           <div
                              style={{
                                 paddingTop: topSafeArea,
                              }}
                              className={clsx(
                                 isMobileApp
                                    ? "bg-white/90 backdrop-blur-lg dark:bg-bg3Dark/80"
                                    : "border-color bg-2 shadow-1 border-b shadow-sm",
                                 " relative mx-auto w-full laptop:max-w-[736px] laptop:rounded-xl laptop:border"
                              )}
                              id="spinner-container"
                           >
                              <div className="relative mx-auto flex h-[58px] items-center justify-between px-3">
                                 {searchToggle ? (
                                    <SearchComboBox
                                       siteType={site.type}
                                       setSearchToggle={setSearchToggle}
                                    />
                                 ) : (
                                    <>
                                       <div
                                          className={clsx(
                                             { truncate: !isMobileApp },
                                             "flex items-center"
                                          )}
                                       >
                                          <Link
                                             prefetch="intent"
                                             to={`/${site.slug}`}
                                             className={clsx(
                                                isMobileApp
                                                   ? "group mr-3"
                                                   : "hover:bg-3 truncate p-1 pr-4 font-bold",
                                                "flex items-center rounded-full"
                                             )}
                                          >
                                             {!isSiteHome && isMobileApp && (
                                                <ChevronLeft
                                                   className="mr-1"
                                                   size={24}
                                                />
                                             )}
                                             <div
                                                className={clsx(
                                                   isMobileApp
                                                      ? "border-color border transition duration-300 group-active:translate-y-0.5"
                                                      : "",
                                                   "shadow-1 h-9 w-9 flex-none overflow-hidden rounded-full shadow"
                                                )}
                                             >
                                                <Image
                                                   width={40}
                                                   height={40}
                                                   url={site.icon?.url}
                                                   options="aspect_ratio=1:1&height=120&width=120"
                                                   alt="Site Logo"
                                                />
                                             </div>
                                             <div
                                                className={clsx(
                                                   { hidden: isMobileApp },
                                                   "truncate pl-3"
                                                )}
                                             >
                                                {site.name}
                                             </div>
                                          </Link>
                                          {isMobileApp && (
                                             <>
                                                <LoggedOut>
                                                   <Link
                                                      prefetch="intent"
                                                      reloadDocument={
                                                         site.type !=
                                                            "custom" && true
                                                      }
                                                      to={`/login?redirectTo=/${site.slug}`}
                                                      className="flex h-8 w-[70px] items-center justify-center rounded-full bg-black
                                                      text-xs font-bold text-white dark:bg-white dark:text-black"
                                                   >
                                                      Follow
                                                   </Link>
                                                </LoggedOut>
                                                <NotFollowingSite>
                                                   <div className="flex items-center">
                                                      <fetcher.Form
                                                         className="w-full"
                                                         method="post"
                                                      >
                                                         <button
                                                            name="intent"
                                                            value="followSite"
                                                            className="flex h-8 w-[70px] items-center justify-center rounded-full bg-black
                                                            text-xs font-bold text-white dark:bg-white dark:text-black"
                                                         >
                                                            {adding ? (
                                                               <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                                            ) : (
                                                               t(
                                                                  "follow.actionFollow"
                                                               )
                                                            )}
                                                         </button>
                                                      </fetcher.Form>
                                                   </div>
                                                </NotFollowingSite>
                                             </>
                                          )}
                                       </div>
                                       <div className="flex items-center gap-3 pl-2">
                                          <FollowingSite>
                                             <Menu
                                                as="div"
                                                className="relative"
                                             >
                                                {({ open }) => (
                                                   <>
                                                      <Menu.Button
                                                         className="text-1 hover:bg-3 flex h-9 w-9 
                                       items-center justify-center rounded-full transition duration-300 active:translate-y-0.5"
                                                      >
                                                         {open ? (
                                                            <X
                                                               size={20}
                                                               className={`${
                                                                  open &&
                                                                  "text-red-500"
                                                               } transition duration-150 ease-in-out`}
                                                            />
                                                         ) : (
                                                            <>
                                                               <Settings2
                                                                  size={20}
                                                                  className="transition duration-150 ease-in-out"
                                                               />
                                                            </>
                                                         )}
                                                      </Menu.Button>
                                                      <Transition
                                                         as={Fragment}
                                                         enter="transition ease-out duration-100"
                                                         enterFrom="transform opacity-0 scale-95"
                                                         enterTo="transform opacity-100 scale-100"
                                                         leave="transition ease-in duration-75"
                                                         leaveFrom="transform opacity-100 scale-100"
                                                         leaveTo="transform opacity-0 scale-95"
                                                      >
                                                         <Menu.Items
                                                            className="absolute right-0 z-30 mt-1.5 w-full min-w-[200px]
                                        max-w-md origin-top-right transform transition-all"
                                                         >
                                                            <div
                                                               className="border-color bg-2 shadow-1 rounded-lg border
                                            p-1.5 shadow-sm"
                                                            >
                                                               <Menu.Item>
                                                                  <fetcher.Form method="post">
                                                                     <button
                                                                        name="intent"
                                                                        value="unfollow"
                                                                        className="text-1 flex w-full items-center gap-3 rounded-lg
                                                      px-2.5 py-2 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                                     >
                                                                        <LogOut
                                                                           className="text-red-400"
                                                                           size="18"
                                                                        />
                                                                        {t(
                                                                           "follow.actionUnfollow"
                                                                        )}
                                                                     </button>
                                                                  </fetcher.Form>
                                                               </Menu.Item>
                                                            </div>
                                                         </Menu.Items>
                                                      </Transition>
                                                   </>
                                                )}
                                             </Menu>
                                          </FollowingSite>
                                          <LoggedOut>
                                             <div className="flex items-center">
                                                <Link
                                                   prefetch="intent"
                                                   reloadDocument={
                                                      site.type != "custom" &&
                                                      true
                                                   }
                                                   to={`/login?redirectTo=/${site.slug}`}
                                                   className="flex h-9 items-center justify-center rounded-full bg-zinc-700 px-3.5
                               text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden"
                                                >
                                                   Follow
                                                </Link>
                                             </div>
                                          </LoggedOut>
                                          <NotFollowingSite>
                                             <div className="flex items-center">
                                                <fetcher.Form
                                                   className="w-full"
                                                   method="post"
                                                >
                                                   <button
                                                      name="intent"
                                                      value="followSite"
                                                      className="flex h-9 items-center justify-center rounded-full bg-black
                                  px-3.5 text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden"
                                                   >
                                                      {adding ? (
                                                         <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                                      ) : (
                                                         t(
                                                            "follow.actionFollow"
                                                         )
                                                      )}
                                                   </button>
                                                </fetcher.Form>
                                             </div>
                                          </NotFollowingSite>
                                          <button
                                             className="bg-3 border-color shadow-1 flex h-10 w-10 items-center justify-center
                                   rounded-full border shadow-sm"
                                             aria-label="Search"
                                             onClick={() => {
                                                setSearchToggle(true);
                                             }}
                                          >
                                             <Search size={20} />
                                          </button>
                                          <button
                                             className="bg-3 border-color shadow-1 flex h-10 w-10 items-center justify-center rounded-full
                                             border shadow-sm transition duration-300 active:translate-y-0.5 desktop:hidden"
                                             aria-label="Menu"
                                             onClick={() =>
                                                setMainMenuOpen(true)
                                             }
                                          >
                                             <MenuIcon size={20} />
                                          </button>
                                       </div>
                                    </>
                                 )}
                              </div>
                           </div>
                        </section>
                        <div
                           className={clsx(
                              isMobileApp ? "pt-3" : "pt-20 laptop:pt-12"
                           )}
                        >
                           <Outlet />
                        </div>
                     </section>
                     {/* ==== Right Sidebar ==== */}
                     <section
                        className="bg-2 border-color relative z-20 max-laptop:mx-auto
               max-laptop:max-w-[728px] laptop:block laptop:border-l laptop:border-r-0"
                     >
                        <div
                           style={{
                              paddingBottom: bottomSafeArea,
                           }}
                           className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto"
                        >
                           <div className="border-color border-b laptop:pt-14">
                              <section className="border-color py-4 max-tablet:border-b max-tablet:px-3 laptop:hidden">
                                 <div className="grid grid-cols-2 gap-3">
                                    <Link
                                       onClick={() => setMainMenuOpen(false)}
                                       className="shadow-1 bg-3 relative flex items-center gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                       prefetch="intent"
                                       to={`/${site.slug}/posts`}
                                    >
                                       <PencilSquareIcon className="h-[17px] w-[17px] text-emerald-500" />
                                       <span>Posts</span>
                                    </Link>
                                    <Link
                                       onClick={() => setMainMenuOpen(false)}
                                       className="shadow-1 bg-3 relative flex items-center gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                       prefetch="intent"
                                       to={`/${site.slug}/collections`}
                                    >
                                       <CircleStackIcon className="h-[17px] w-[17px] text-yellow-500" />
                                       <span>Collections</span>
                                    </Link>
                                 </div>
                                 {site?.pinned && site?.pinned?.length > 1 && (
                                    <>
                                       <div className="flex items-center gap-2 pb-2.5 pl-2 pt-5">
                                          <Pin
                                             className="text-red-400"
                                             size={14}
                                          />
                                          <span className="text-1 text-sm font-bold">
                                             Pinned
                                          </span>
                                       </div>
                                       <ul className="space-y-2">
                                          {site.pinned?.map((item: any) => (
                                             <li key={item.id}>
                                                <Link
                                                   onClick={() =>
                                                      setMainMenuOpen(false)
                                                   }
                                                   className="shadow-1 bg-3 relative flex items-center 
                                                      gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                                   prefetch="intent"
                                                   to={pinnedLinkUrlGenerator(
                                                      item,
                                                      site?.slug ?? ""
                                                   )}
                                                >
                                                   <div className="h-5 w-5">
                                                      {item.relation?.value
                                                         ?.icon?.url ? (
                                                         <Image
                                                            width={80}
                                                            height={80}
                                                            url={
                                                               item.relation
                                                                  ?.value?.icon
                                                                  ?.url
                                                            }
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
                                                </Link>
                                             </li>
                                          ))}
                                       </ul>
                                    </>
                                 )}
                              </section>
                              {site.about && (
                                 <section className="border-color border-b p-4 px-4 tablet:px-0 laptop:p-4">
                                    <div className="flex items-center gap-1.5 pb-2.5">
                                       <Component size={14} />
                                       <span className="text-1 text-sm font-bold">
                                          About
                                       </span>
                                    </div>
                                    <div className="text-1 text-sm">
                                       {site.about}
                                    </div>
                                 </section>
                              )}
                              <section className="p-4 px-4 tablet:px-0 laptop:p-4">
                                 <div className="flex items-center gap-1.5 pb-3">
                                    <Users size={14} />
                                    <span className="text-1 text-sm font-bold">
                                       Contributors
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    {site.admins?.length === 0 ? null : (
                                       <>
                                          {site.admins?.map((user: any) => (
                                             <Tooltip
                                                key={user.id}
                                                id="site-contributors"
                                                content={user.username}
                                             >
                                                <div
                                                   className="bg-3 shadow-1 flex h-9 w-9 items-center justify-center
                                          overflow-hidden rounded-full border border-zinc-200 shadow-sm dark:border-zinc-600"
                                                >
                                                   {user.avatar?.url ? (
                                                      <Image
                                                         url={user.avatar?.url}
                                                         options="aspect_ratio=1:1&height=80&width=80"
                                                         alt="User Avatar"
                                                      />
                                                   ) : (
                                                      <Dog
                                                         className="text-1"
                                                         size={20}
                                                      />
                                                   )}
                                                </div>
                                             </Tooltip>
                                          ))}
                                          <Tooltip
                                             key={site?.owner?.id}
                                             id="site-creator"
                                             content={site?.owner?.username}
                                          >
                                             <div
                                                className="bg-3 shadow-1 h-9 w-9 overflow-hidden rounded-full 
                                          border border-zinc-200 shadow-sm dark:border-zinc-600"
                                             >
                                                {site?.owner?.avatar?.url ? (
                                                   <Image
                                                      url={
                                                         site?.owner?.avatar
                                                            ?.url
                                                      }
                                                      options="aspect_ratio=1:1&height=80&width=80"
                                                      alt="User Avatar"
                                                   />
                                                ) : (
                                                   <div
                                                      className="bg-3 shadow-1 flex h-9 w-9 items-center
                                                justify-center overflow-hidden rounded-full shadow-sm dark:border-zinc-700"
                                                   >
                                                      <Dog
                                                         className="text-1"
                                                         size={20}
                                                      />
                                                   </div>
                                                )}
                                             </div>
                                          </Tooltip>
                                       </>
                                    )}
                                    <Tooltip
                                       id="join-site"
                                       content="Coming Soon!"
                                    >
                                       <div
                                          className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                                       >
                                          Join
                                       </div>
                                    </Tooltip>
                                 </div>
                              </section>
                           </div>
                           <div className="border-color flex items-center justify-center">
                              {/* <div className="bg-1 h-[250px] w-[300px] rounded-lg" /> */}
                           </div>
                        </div>
                     </section>
                  </div>

                  {/* ==== Mobile App Nav ==== */}
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
                              onClick={() => setMenuOpen(true)}
                           >
                              <Squares2X2Icon
                                 className="mx-auto h-6 w-6 text-blue-500 transition duration-300 group-active:translate-y-0.5"
                                 aria-hidden="true"
                              />
                              <div className="text-center text-[9px] font-bold">
                                 Following
                              </div>
                           </button>
                           {/* <div className="space-y-1 p-3">
                              <Bookmark
                                 size={18}
                                 className="mx-auto text-blue-500 transition duration-300 active:translate-y-0.5"
                                 aria-hidden="true"
                              />
                              <div className="text-center text-[9px] font-bold">
                                 Bookmarks
                              </div>
                           </div> */}
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

                  {/* ==== Google Analytics ==== */}
                  {process.env.NODE_ENV === "production" &&
                  gaTrackingId &&
                  !isBot ? (
                     <>
                        <script
                           defer
                           src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
                        />
                        <script
                           defer
                           id="gtag-init"
                           dangerouslySetInnerHTML={{
                              __html: `
                              window.dataLayer = window.dataLayer || [];
                              function gtag(){dataLayer.push(arguments);}
                              gtag('js', new Date());

                              gtag('config', '${gaTrackingId}', {
                                 page_path: window.location.pathname,
                              });
                           `,
                           }}
                        />
                     </>
                  ) : null}

                  {/* ==== Mobile main menu modal (pins) ==== */}
                  <Modal
                     onClose={() => {
                        setMainMenuOpen(false);
                     }}
                     show={isMainMenuOpen}
                  >
                     <div className="bg-2 h-[80vh] w-[96vw] transform rounded-2xl p-4 text-left align-middle shadow-xl transition-all laptop:w-[50vw]">
                        <button
                           type="button"
                           className="bg-1 shadow-1 absolute bottom-7
                              left-1/2 flex h-14 w-14 -translate-x-1/2
                              transform items-center justify-center rounded-full shadow
                            hover:bg-red-50 dark:hover:bg-zinc-700"
                           onClick={() => setMainMenuOpen(false)}
                        >
                           <X size={28} className="text-red-400" />
                        </button>
                        <menu className="space-y-3">
                           <div className="grid grid-cols-2 gap-3">
                              <Link
                                 onClick={() => setMainMenuOpen(false)}
                                 className="shadow-1 bg-3 relative flex items-center gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                 prefetch="intent"
                                 to={`/${site.slug}/posts`}
                              >
                                 <PencilSquareIcon className="h-[17px] w-[17px] text-emerald-500" />
                                 <span>Posts</span>
                              </Link>
                              <Link
                                 onClick={() => setMainMenuOpen(false)}
                                 className="shadow-1 bg-3 relative flex items-center gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                 prefetch="intent"
                                 to={`/${site.slug}/collections`}
                              >
                                 <CircleStackIcon className="h-[17px] w-[17px] text-yellow-500" />
                                 <span>Collections</span>
                              </Link>
                           </div>
                           {site?.pinned && site?.pinned?.length > 1 && (
                              <>
                                 <div className="space-y-0.5 pt-2">
                                    <div className="flex items-center gap-3 pb-2 pl-2">
                                       <div className="flex items-center gap-2 text-sm font-bold">
                                          <Pin
                                             className="text-red-400"
                                             size={15}
                                          />
                                          <span>Pinned</span>
                                       </div>
                                    </div>
                                    <ul className="space-y-2">
                                       {site.pinned?.map((item: any) => (
                                          <li key={item.id}>
                                             <Link
                                                onClick={() =>
                                                   setMainMenuOpen(false)
                                                }
                                                className="shadow-1 bg-3 relative flex items-center 
                                                      gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                                prefetch="intent"
                                                to={pinnedLinkUrlGenerator(
                                                   item,
                                                   site?.slug ?? ""
                                                )}
                                             >
                                                <div className="h-5 w-5">
                                                   {item.relation?.value?.icon
                                                      ?.url ? (
                                                      <Image
                                                         width={80}
                                                         height={80}
                                                         url={
                                                            item.relation?.value
                                                               ?.icon?.url
                                                         }
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
                                             </Link>
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              </>
                           )}
                        </menu>
                     </div>
                  </Modal>
                  {/* ==== Following Modal ==== */}
                  <Modal
                     onClose={() => {
                        setMenuOpen(false);
                     }}
                     show={isMenuOpen}
                  >
                     <div className="bg-2 h-[80vh] w-[96vw] transform rounded-2xl p-4 text-left align-middle shadow-xl transition-all">
                        <button
                           type="button"
                           className="bg-1 shadow-1 absolute bottom-7
                              left-1/2 flex h-14 w-14 -translate-x-1/2
                              transform items-center justify-center rounded-full shadow
                            hover:bg-red-50 dark:hover:bg-zinc-700"
                           onClick={() => setMenuOpen(false)}
                        >
                           <X size={28} className="text-red-400" />
                        </button>
                        <LoggedOut>
                           <div className="space-y-3">
                              <Link
                                 to="/join"
                                 className="shadow-1 group relative inline-flex h-10 w-full items-center justify-center overflow-hidden 
                           rounded-full p-4 px-5 font-medium text-indigo-600 shadow-sm transition duration-300 ease-out"
                              >
                                 <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                                 <span
                                    className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                           rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                                 ></span>
                                 <span className="relative text-sm font-bold text-white">
                                    {t("login.signUp", { ns: "auth" })}
                                 </span>
                              </Link>
                              <Link
                                 className="border-color bg-3 shadow-1 flex h-10 items-center
                           justify-center rounded-full border text-center text-sm
                           font-bold shadow-sm"
                                 to={`/login?redirectTo=${location.pathname}`}
                              >
                                 {t("login.action", { ns: "auth" })}
                              </Link>
                              {isMobileApp && (
                                 <section className="relative z-10 pt-8">
                                    <div className="text-1 pb-2.5 pl-1 text-sm font-bold">
                                       Featured
                                    </div>
                                    {coreMeta.featuredSites?.length ===
                                    0 ? null : (
                                       <menu className="space-y-3">
                                          {coreMeta.featuredSites?.map(
                                             ({ site }) => (
                                                <Link
                                                   prefetch="render"
                                                   reloadDocument={
                                                      site.type == "custom" &&
                                                      true
                                                   }
                                                   key={site.id}
                                                   className="shadow-1 bg-3 border-color relative flex w-full items-center justify-between gap-3 rounded-xl border pr-4 shadow-sm"
                                                   to={`/${site.slug}`}
                                                >
                                                   <>
                                                      <div className="flex w-full items-center gap-3 truncate p-2">
                                                         <div className="h-7 w-7">
                                                            <Image
                                                               className="border-color overflow-hidden rounded-full border shadow-sm"
                                                               width={32}
                                                               height={32}
                                                               alt="Site Logo"
                                                               options="aspect_ratio=1:1&height=120&width=120"
                                                               url={
                                                                  site.icon?.url
                                                               }
                                                            />
                                                         </div>
                                                         <div className="truncate text-sm font-bold">
                                                            {site.name}
                                                         </div>
                                                      </div>
                                                   </>
                                                </Link>
                                             )
                                          )}
                                       </menu>
                                    )}
                                 </section>
                              )}
                           </div>
                        </LoggedOut>
                        {following?.length === 0 ? null : (
                           <menu className="space-y-3">
                              {following?.map((item) => (
                                 <NavLink
                                    prefetch="intent"
                                    reloadDocument={
                                       // Reload if custom site, but NOT if current site is custom
                                       item.type == "custom" &&
                                       site.type != "custom" &&
                                       true
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
                           </menu>
                        )}
                     </div>
                  </Modal>

                  {/* ==== User Native Mobile Menu ==== */}
                  <Modal
                     onClose={() => {
                        setUserMenuOpen(false);
                     }}
                     show={isUserMenuOpen}
                  >
                     <div className="bg-2 h-[80vh] w-[96vw] transform rounded-2xl p-4 text-left align-middle shadow-xl transition-all">
                        <button
                           type="button"
                           className="bg-1 shadow-1 absolute bottom-7
                              left-1/2 flex h-14 w-14 -translate-x-1/2
                              transform items-center justify-center rounded-full shadow
                            hover:bg-red-50 dark:hover:bg-zinc-700"
                           onClick={() => setUserMenuOpen(false)}
                        >
                           <X size={28} className="text-red-400" />
                        </button>
                        <section>
                           <LoggedOut>
                              <div className="m-4 space-y-3">
                                 <Link
                                    to="/join"
                                    className="shadow-1 group relative inline-flex h-10 w-full items-center justify-center overflow-hidden 
                           rounded-full p-4 px-5 font-medium text-indigo-600 shadow-sm transition duration-300 ease-out"
                                 >
                                    <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                                    <span
                                       className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                           rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                                    ></span>
                                    <span className="relative text-sm font-bold text-white">
                                       {t("login.signUp", { ns: "auth" })}
                                    </span>
                                 </Link>
                                 <Link
                                    className="border-color bg-3 shadow-1 flex h-10 items-center
                                    justify-center rounded-full border text-center text-sm
                                    font-bold shadow-sm"
                                    to={`/login?redirectTo=${location.pathname}`}
                                 >
                                    {t("login.action", { ns: "auth" })}
                                 </Link>
                              </div>
                           </LoggedOut>
                           <LoggedIn>
                              <Form action="/logout" method="post">
                                 <button
                                    type="submit"
                                    className="shadow-1 bg-3 border-color relative flex w-full items-center
               justify-between gap-3 rounded-xl border px-4 py-3 shadow-sm"
                                 >
                                    <div className="font-bold">Logout</div>
                                    <LogOut
                                       size={18}
                                       className="text-red-400 dark:text-red-300"
                                    />
                                 </button>
                              </Form>
                           </LoggedIn>
                        </section>
                        <div className="border-color mx-40 mt-6 flex items-center justify-center border-t-2 pt-4">
                           <DarkModeToggle />
                        </div>
                     </div>
                  </Modal>
               </div>
            )}
         </Await>
      </Suspense>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   assertIsPost(request);
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   // Follow Site
   if (intent === "followSite") {
      //We need to get the current sites of the user, then prepare the new sites array
      const userId = user?.id;
      const userCurrentSites = user?.sites || [];
      //@ts-ignore
      const sites = userCurrentSites.map(({ id }: { id }) => id);
      //Finally we update the user with the new site id

      const siteData = await payload.find({
         collection: "sites",
         where: {
            slug: {
               equals: siteId,
            },
         },
         user,
      });
      const siteUID = siteData?.docs[0].id;

      return await payload.update({
         collection: "users",
         id: userId ?? "",
         data: { sites: [...sites, siteUID] },
         overrideAccess: false,
         user,
      });
   }

   // Unfollow Site
   if (intent === "unfollow") {
      const userId = user?.id;

      const siteData = await payload.find({
         collection: "sites",
         where: {
            slug: {
               equals: siteId,
            },
         },
         user,
      });
      const siteUID = siteData?.docs[0].id;
      const site = await payload.findByID({
         collection: "sites",
         id: siteUID,
         user,
      });

      // Prevent site creator from leaving own site
      //@ts-ignore
      if (site.owner?.id === userId) {
         return json(
            {
               errors: "Cannot unfollow your own site",
            },
            { status: 400 }
         );
      }
      const userCurrentSites = user?.sites || [];
      //@ts-ignore
      const sites = userCurrentSites.map(({ id }: { id }) => id);

      //Remove the current site from the user's sites array
      const index = sites.indexOf(site.id);
      if (index > -1) {
         // only splice array when item is found
         sites.splice(index, 1); // 2nd parameter means remove one item only
      }
      return await payload.update({
         collection: "users",
         id: userId ?? "",
         data: { sites },
         overrideAccess: false,
         user,
      });
   }
};

const activeStyle = `bg-white shadow-sm shadow-1 text-light dark:bg-bg3Dark dark:text-dark`;
const defaultStyle = `bg-2 hover:bg-white flex items-center gap-2.5 rounded-full font-bold dark:hover:bg-bg3Dark bg-2 text-1 rounded-lg text-sm px-2.5 py-2`;

const PinnedMenu = ({ site }: { site: Site }) => {
   return (
      <>
         {site?.pinned && site?.pinned?.length > 1 && (
            <>
               <div className="space-y-0.5 pl-3 pt-6">
                  <div className="flex items-center gap-2.5 pb-2 pl-2.5">
                     <div className="text-1 flex items-center gap-3 text-sm font-bold">
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

const SideMenu = ({ site, user }: { site: Site; user: User }) => {
   return (
      <>
         <div className="space-y-1 px-3">
            <NavLink
               prefetch="intent"
               end
               className={({ isActive }) =>
                  `${isActive ? activeStyle : ""} ${defaultStyle}`
               }
               to={`/${site.slug}`}
            >
               {({ isActive }) => (
                  <>
                     {isActive ? (
                        <HomeIconBold className="h-[17px] w-[17px] text-blue-500" />
                     ) : (
                        <HomeIcon className="h-[17px] w-[17px] text-blue-500" />
                     )}
                     <span>Home</span>
                  </>
               )}
            </NavLink>
            <NavLink
               prefetch="intent"
               className={({ isActive }) =>
                  `${isActive ? activeStyle : ""} ${defaultStyle}`
               }
               to={`/${site.slug}/posts`}
            >
               {({ isActive }) => (
                  <>
                     {isActive ? (
                        <PencilSquareIconBold className="h-[17px] w-[17px] text-emerald-500" />
                     ) : (
                        <PencilSquareIcon className="h-[17px] w-[17px] text-emerald-500" />
                     )}
                     <span>Posts</span>
                  </>
               )}
            </NavLink>
            <NavLink
               prefetch="intent"
               className={({ isActive }) =>
                  `${isActive ? activeStyle : ""} ${defaultStyle}`
               }
               to={`/${site.slug}/collections`}
            >
               {({ isActive }) => (
                  <>
                     {isActive ? (
                        <CircleStackIconBold className="h-[17px] w-[17px] text-yellow-500" />
                     ) : (
                        <CircleStackIcon className="h-[17px] w-[17px] text-yellow-500" />
                     )}
                     <span>Collections</span>
                  </>
               )}
            </NavLink>
         </div>
         <PinnedMenu site={site} />
         <div className="text-1 space-y-0.5 p-3">
            <AdminOrStaffOrOwner>
               {site.type == "custom" && (
                  <a
                     className="flex items-center gap-3.5 px-3 py-2 font-bold"
                     href={`https://${site.slug}-db.${settings.domain}/admin`}
                  >
                     <>
                        <HardDrive
                           className="text-slate-400 dark:text-slate-500"
                           size={15}
                        />
                        <span className="text-xs">Site</span>
                     </>
                  </a>
               )}
            </AdminOrStaffOrOwner>
            {user?.roles?.includes("staff") && (
               <a
                  className="flex items-center gap-3.5 px-3 py-2 font-bold"
                  href="/admin"
               >
                  <>
                     <Lock
                        className="text-slate-400 dark:text-slate-500"
                        size={15}
                     />
                     <span className="text-xs">Staff</span>
                  </>
               </a>
            )}
         </div>
      </>
   );
};

const pinnedLinkUrlGenerator = (item: any, siteSlug: string) => {
   const type = item.relation?.relationTo;

   switch (type) {
      case "customPages": {
         const slug = item.relation?.value.slug;
         return `/${siteSlug}/${slug}`;
      }
      case "collections": {
         const slug = item.relation?.value.slug;
         return `/${siteSlug}/collections/${slug}`;
      }
      case "entries": {
         const slug = item.relation?.value.slug;
         const id = item.relation?.value.id;
         const collection = item.relation?.value.collectionEntity.slug;
         return `/${siteSlug}/collections/${collection}/${id}/${slug}`;
      }
      case "posts": {
         const id = item.relation?.value.id;
         return `/${siteSlug}/posts/${id}`;
      }
      default:
         return "/";
   }
};

// const followersUrl = `${url}/api/users?depth=0&where[sites][equals]=${site.id}`;

// (await (
//    await fetch(followersUrl, {
//       headers: {
//          cookie: request.headers.get("cookie") ?? "",
//       },
//    })
// ).json()) as PaginatedDocs,
