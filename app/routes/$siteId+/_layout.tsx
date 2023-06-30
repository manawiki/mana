import {
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
   ChevronDown,
   Component,
   Dog,
   HardDrive,
   Loader2,
   Lock,
   LogOut,
   MenuIcon,
   MoreVertical,
   Pin,
   Search,
   User as UserIcon,
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
import { assertIsPost, isAdding } from "~/utils";
import {
   AdminOrStaffOrOwner,
   FollowingSite,
   LoggedIn,
   LoggedOut,
   NotFollowingSite,
} from "~/modules/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/Image";
import {
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
   HomeIcon as HomeIconBold,
   PencilSquareIcon as PencilSquareIconBold,
   CircleStackIcon as CircleStackIconBold,
} from "@heroicons/react/24/solid";
import customStylesheetUrl from "~/_custom/styles.css";
import { NewSiteModal } from "~/routes/action+/new-site-modal";
import type { User, Site, Update } from "payload/generated-types";
import { Modal } from "~/components";
import Tooltip from "~/components/Tooltip";
import * as gtag from "~/routes/$siteId+/utils/gtags.client";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import SearchComboBox from "./resource+/Search";

import { useIsBot } from "~/utils/isBotProvider";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   try {
      const url = new URL(request.url).origin;

      const siteUrl = `${url}/api/sites?where[slug][equals]=${siteId}&depth=2`;

      const { docs: slug } = (await fetchWithCache(siteUrl, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })) as PaginatedDocs<Site>;

      const site = slug[0];

      if (!site) {
         throw json(null, { status: 404 });
      }

      const updatesUrl = `${url}/api/updates?where[site.slug][equals]=${siteId}&depth=0&sort=-createdAt`;

      const { docs: updateResults } = (await fetchWithCache(updatesUrl, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })) as PaginatedDocs<Update>;

      // const followersUrl = `${url}/api/users?depth=0&where[sites][equals]=${site.id}`;

      // (await (
      //    await fetch(followersUrl, {
      //       headers: {
      //          cookie: request.headers.get("cookie") ?? "",
      //       },
      //    })
      // ).json()) as PaginatedDocs,

      return json(
         { updateResults, site },
         { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } }
      );
   } catch (e) {
      throw new Response("Internal Server Error", { status: 500 });
   }
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: data.site.name,
      },
   ];
};

export const links: LinksFunction = () => {
   return [
      { rel: "preload", href: customStylesheetUrl, as: "style" },
      { rel: "stylesheet", href: customStylesheetUrl },

      // { rel: "preload", href: nProgressStyles, as: "style" },
      // { rel: "stylesheet", href: nProgressStyles },
   ];
};

export const handle = {
   i18n: "site",
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

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);
   const location = useLocation();

   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];
   const [isMenuOpen, setMenuOpen] = useState(false);
   const [isMainMenuOpen, setMainMenuOpen] = useState(false);

   const gaTrackingId = site?.gaTagId;
   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTrackingId) {
         gtag.pageview(location.pathname, gaTrackingId);
      }
      setSearchToggle(false);
   }, [location, gaTrackingId]);

   const [searchToggle, setSearchToggle] = useState(false);
   let isBot = useIsBot();

   return (
      <>
         {process.env.NODE_ENV === "production" && gaTrackingId && !isBot ? (
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
         {/* Mobile main menu modal (pins) */}
         <Modal
            onClose={() => {
               setMainMenuOpen(false);
            }}
            show={isMainMenuOpen}
         >
            <div className="bg-2 h-[80vh] w-[96vw] transform rounded-2xl p-4 text-left align-middle shadow-xl transition-all laptop:w-[50vw]">
               <button
                  name="intent"
                  value="addSite"
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
                                 <Pin className="text-red-400" size={15} />
                                 <span>Pinned</span>
                              </div>
                           </div>
                           <ul className="space-y-2">
                              {site.pinned?.map((item: any) => (
                                 <li key={item.id}>
                                    <Link
                                       onClick={() => setMainMenuOpen(false)}
                                       className="shadow-1 bg-3 relative flex items-center 
                                                      gap-3 rounded-xl p-3 pr-4 text-sm font-bold shadow-sm"
                                       prefetch="intent"
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
                                                url={
                                                   item.relation?.value?.icon
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
                        </div>
                     </>
                  )}
               </menu>
            </div>
         </Modal>
         <header className="bg-2 border-color fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b px-3">
            <LoggedIn>
               <div className="z-10 flex items-center gap-3">
                  <div className="laptop:hidden">
                     {/* Mobile site menu modal */}
                     <Modal
                        onClose={() => {
                           setMenuOpen(false);
                        }}
                        show={isMenuOpen}
                     >
                        <div className="bg-2 h-[80vh] w-[96vw] transform rounded-2xl p-4 text-left align-middle shadow-xl transition-all">
                           <button
                              name="intent"
                              value="addSite"
                              type="button"
                              className="bg-1 shadow-1 absolute bottom-7
                              left-1/2 flex h-14 w-14 -translate-x-1/2
                              transform items-center justify-center rounded-full shadow
                            hover:bg-red-50 dark:hover:bg-zinc-700"
                              onClick={() => setMenuOpen(false)}
                           >
                              <X size={28} className="text-red-400" />
                           </button>
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
                                       className="shadow-1 bg-3 relative flex items-center justify-between gap-3 rounded-xl p-2 pr-4 shadow-sm"
                                       to={`/${item.slug}`}
                                    >
                                       {({ isActive }) => (
                                          <>
                                             <div className="flex items-center gap-3 truncate">
                                                <div
                                                   className="h-8 w-8 flex-none 
                                    overflow-hidden rounded-full laptop:h-[50px] laptop:w-[50px]"
                                                >
                                                   <Image
                                                      alt="Site Logo"
                                                      options="aspect_ratio=1:1&height=120&width=120"
                                                      url={item.icon?.url}
                                                   />
                                                </div>
                                                <div className="text-1 truncate text-sm font-bold">
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
                     <div className="flex items-center gap-3">
                        <button
                           className="bg-3 shadow-1 border-color flex h-9 w-9 items-center
                  justify-center rounded-full border shadow-sm"
                           onClick={() => setMenuOpen(true)}
                        >
                           <MoreVertical size={20} />
                        </button>
                        <NotFollowingSite>
                           <div className="flex items-center">
                              <fetcher.Form className="w-full" method="post">
                                 <button
                                    name="intent"
                                    value="followSite"
                                    className="flex h-9 items-center justify-center rounded-full bg-black
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
                     </div>
                  </div>
               </div>
               <section className="z-50 flex h-14 items-center justify-end gap-2.5">
                  <DarkModeToggle />
                  <Menu as="div" className="relative">
                     <Menu.Button
                        className="bg-3 shadow-1 border-color flex h-9 w-9 items-center
                         justify-center rounded-full border shadow-sm"
                     >
                        <UserIcon size={20} />
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
                           className="absolute right-0 z-10 mt-1 w-full min-w-[200px]
                                   max-w-md origin-top-right transform transition-all"
                        >
                           <div className="border-color bg-3 shadow-1 rounded-lg border p-1 shadow">
                              <Menu.Item>
                                 <Form action="/logout" method="post">
                                    <button
                                       type="submit"
                                       className="text-1 flex w-full items-center gap-3 rounded-lg
                                             p-2 pl-3 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                    >
                                       <div className="flex-grow text-left">
                                          Logout
                                       </div>
                                       <LogOut
                                          size={18}
                                          className="text-red-400 dark:text-red-300"
                                       />
                                    </button>
                                 </Form>
                              </Menu.Item>
                           </div>
                        </Menu.Items>
                     </Transition>
                  </Menu>
               </section>
            </LoggedIn>
            <LoggedOut>
               <Link
                  prefetch="intent"
                  reloadDocument={site.type != "custom" && true}
                  to={`/login?redirectTo=/${site.slug}`}
                  className="z-20 flex h-8 items-center justify-center rounded-full bg-zinc-700 px-3.5
                               text-sm font-bold text-white dark:bg-white dark:text-black laptop:hidden"
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
               className="pattern-opacity-50 pattern-dots absolute
                   left-0 top-0
                     h-full w-full pattern-bg-white pattern-zinc-300 
                     pattern-size-2 dark:pattern-bg-bg1Dark dark:pattern-bg4Dark"
            />
         </header>
         <div
            className="laptop:grid laptop:min-h-screen
                laptop:auto-cols-[82px_0px_1fr_334px] laptop:grid-flow-col
                desktop:auto-cols-[82px_220px_1fr_334px]"
         >
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
                   max-laptop:gap-3  laptop:mb-4 laptop:space-y-3"
                              >
                                 {following?.map((item) => (
                                    <li key={item.id}>
                                       <div className="relative flex items-center justify-center">
                                          <NavLink
                                             prefetch="intent"
                                             reloadDocument={
                                                // Reload if custom site, but NOT if current site is custom
                                                item.type == "custom" &&
                                                site.type != "custom" &&
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
                                                         url={item.icon?.url}
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
            <section>
               <div className="bg-1 bg-2 border-color fixed bottom-0 top-0 z-50 mx-auto hidden h-full w-[220px] overflow-y-auto border-r py-4 desktop:block">
                  <SideMenu site={site} user={user} />
               </div>
            </section>
            <section className="max-laptop:border-color bg-3 max-laptop:border-b">
               <section
                  className="sticky z-40 max-laptop:top-[56px] laptop:top-6 
               laptop:z-50 laptop:px-3"
               >
                  <div
                     className=" border-color bg-2 shadow-1 relative mx-auto h-16 w-full border-b pl-2 pr-3 
                     shadow-sm laptop:max-w-[736px] laptop:rounded-xl laptop:border"
                     id="spinner-container"
                  >
                     <div className="flex h-full items-center justify-between">
                        {searchToggle ? (
                           <SearchComboBox
                              siteType={site.type}
                              setSearchToggle={setSearchToggle}
                           />
                        ) : (
                           <>
                              <Link
                                 prefetch="intent"
                                 to={`/${site.slug}`}
                                 className="hover:bg-3 flex items-center gap-3 truncate rounded-full p-1 pr-4 font-bold"
                              >
                                 <div className="shadow-1 h-8 w-8 flex-none overflow-hidden rounded-full bg-zinc-200 shadow">
                                    <Image
                                       url={site.icon?.url}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       alt="Site Logo"
                                    />
                                 </div>
                                 <div className="truncate">{site.name}</div>
                              </Link>
                              <div className="flex items-center gap-3 pl-2">
                                 <FollowingSite>
                                    <Menu as="div" className="relative">
                                       {({ open }) => (
                                          <>
                                             <Menu.Button
                                                className="bg-2 text-1 hover:bg-3 flex h-9 w-9 
                                       items-center justify-center rounded-full transition duration-300 active:translate-y-0.5"
                                             >
                                                {open ? (
                                                   <X
                                                      size={20}
                                                      className={`${
                                                         open && "text-red-500"
                                                      } transition duration-150 ease-in-out`}
                                                   />
                                                ) : (
                                                   <>
                                                      <ChevronDown
                                                         size={24}
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
                                             site.type != "custom" && true
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
                                                t("follow.actionFollow")
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
                                   border shadow-sm desktop:hidden"
                                    aria-label="Menu"
                                    onClick={() => setMainMenuOpen(true)}
                                 >
                                    <MenuIcon size={20} />
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               </section>
               <Outlet />
            </section>
            {/* Right Sidebar */}
            <section
               className="bg-2 border-color relative z-20 max-laptop:mx-auto
               max-laptop:max-w-[728px] laptop:block laptop:border-l laptop:border-r-0"
            >
               <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <div className="divide-color border-color divide-y border-b laptop:pt-14">
                     {site.about && (
                        <section className="p-4 px-4 tablet:px-0 laptop:p-4">
                           <div className="flex items-center gap-1.5 pb-2.5">
                              <Component size={14} />
                              <span className="text-1 text-sm font-bold">
                                 About
                              </span>
                           </div>
                           <div className="text-1 text-sm">{site.about}</div>
                           {/* <div className="grid grid-cols-3 gap-3">
                           {followers ? (
                              <div className="text-xs">
                                 <div>{followers}</div>
                                 <div className="text-1">members</div>
                              </div>
                           ) : null}
                           {followers ? (
                              <div className="text-xs">
                                 <div>{followers}</div>
                                 <div className="text-1">pages</div>
                              </div>
                           ) : null}
                        </div> */}
                        </section>
                     )}
                     {/* {site.about && (
                        <section className="p-4 px-4 tablet:px-0 laptop:p-4">
                           <div className="flex items-center gap-1.5 pb-2.5">
                              <span className="text-1 text-sm font-bold">
                                 Level 1
                              </span>
                           </div>
                           <div className="text-1 h-2 rounded-full bg-blue-400 text-sm"></div>
                        </section>
                     )} */}

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
                                             url={site?.owner?.avatar?.url}
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

                           <Tooltip id="join-site" content="Coming Soon!">
                              <div
                                 className="shadow-1 flex h-9 items-center justify-center rounded-full
                                 bg-zinc-500 px-4 text-sm font-semibold text-white shadow dark:bg-zinc-600"
                              >
                                 Join
                              </div>
                           </Tooltip>
                        </div>
                     </section>
                     <section className="p-4 px-4 tablet:px-0 laptop:hidden laptop:p-4">
                        <div className="grid grid-cols-2 gap-3 pb-4">
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
                              <div className="flex items-center gap-1.5 pb-3">
                                 <Pin size={14} />
                                 <span className="text-1 text-sm font-bold">
                                    Pinned
                                 </span>
                              </div>
                              <ul className="space-y-2">
                                 {site.pinned?.map((item: any) => (
                                    <li key={item.id}>
                                       <Link
                                          onClick={() => setMainMenuOpen(false)}
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
                                                      item.relation?.value?.icon
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
                  </div>
                  <div className="border-color flex items-center justify-center">
                     {/* <div className="bg-1 h-[250px] w-[300px] rounded-lg" /> */}
                  </div>
               </div>
            </section>
         </div>
      </>
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
               <div className="space-y-0.5 pl-3 pt-5">
                  <div className="flex items-center gap-3 pb-2 pl-3">
                     <div className="text-1 flex items-center gap-3 text-sm font-bold">
                        <Pin className="text-red-400" size={15} />
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
                                 } ${defaultStyle} relative text-xs`
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
                     href={`https://${site.slug}-db.mana.wiki/admin`}
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
