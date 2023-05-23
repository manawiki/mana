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
   Info,
   Loader2,
   Lock,
   LogOut,
   MoreVertical,
   Pin,
   Search,
   Star,
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
import type { User, Site } from "payload-types";
import { Modal } from "~/components";
import Tooltip from "~/components/Tooltip";
import * as gtag from "~/routes/$siteId+/utils/gtags.client";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import SearchComboBox from "./resource+/Search";

// See https://github.com/payloadcms/payload/discussions/1319 regarding relational typescript support

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const url = new URL(request.url).origin;
   const slug = (await (
      await fetch(`${url}/api/sites?where[slug][equals]=${siteId}&depth=2`, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })
   ).json()) as PaginatedDocs<Site>;
   const site = slug?.docs[0];
   if (!site) {
      throw json(null, { status: 404 });
   }

   return json(
      { site },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
   );
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
   const defaultStyle = `bg-2 
   flex items-center justify-center gap-3 rounded-full font-bold max-desktop:mx-auto
   max-desktop:h-12 max-desktop:w-12 bg-2
   max-laptop:-mt-6 laptop:rounded-xl desktop:px-3.5 desktop:py-3 desktop:justify-start`;
   const { user } = useRouteLoaderData("root") as { user: User };
   const following = user?.sites as Site[];
   const [isMenuOpen, setMenuOpen] = useState(false);
   const gaTrackingId = site?.gaTagId;
   useEffect(() => {
      if (gaTrackingId?.length) {
         gtag.pageview(location.pathname, gaTrackingId);
      }
   }, [location, gaTrackingId]);
   const [searchToggle, setSearchToggle] = useState(false);

   return (
      <>
         {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
            <>
               <script
                  async
                  src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
               />
               <script
                  async
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
         )}
         <header
            className="bg-1 shadow-1 fixed top-0 z-50 flex
         h-14 w-full items-center justify-between border-b border-zinc-200 
         px-3 shadow-sm dark:border-zinc-800"
         >
            <LoggedIn>
               <Link
                  reloadDocument={site.type == "custom" && true}
                  className="relative z-10 pb-1 font-logo text-[30px] max-laptop:hidden"
                  to="/hq"
               >
                  mana
               </Link>
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
                                                      options="fit=crop,width=88,height=88,gravity=auto"
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
                     <button
                        className="bg-3 shadow-1 border-color flex h-9 w-9 items-center
                  justify-center rounded-full border shadow-sm"
                        onClick={() => setMenuOpen(true)}
                     >
                        <MoreVertical size={20} />
                     </button>
                  </div>
               </div>
               <Link
                  className="relative z-10 pb-1 font-logo text-[30px] laptop:hidden"
                  to="/hq"
               >
                  mana
               </Link>
               <section className="z-50 flex h-14 items-center justify-end gap-2.5">
                  <DarkModeToggle />
                  <AdminOrStaffOrOwner>
                     {site.type == "custom" && (
                        <Tooltip id="site-dashboard" content="Site Dashboard">
                           <a
                              className="bg-3 shadow-1 border-color flex h-8 w-8 items-center
                         justify-center rounded-xl border shadow-sm"
                              href={`https://${site.slug}-db.mana.wiki/admin`}
                           >
                              <HardDrive className="text-1" size={16} />
                           </a>
                        </Tooltip>
                     )}
                  </AdminOrStaffOrOwner>
                  {user?.roles?.includes("staff") && (
                     <Tooltip id="staff-dashboard" content="Staff Dashboard">
                        <a
                           className="bg-3 shadow-1 border-color flex h-8 w-8 items-center
                           justify-center rounded-xl border shadow-sm"
                           href="/admin"
                        >
                           <Lock className="text-1" size={16} />
                        </a>
                     </Tooltip>
                  )}
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
                  reloadDocument={site.type == "custom" && true}
                  className="relative z-10 pb-1 font-logo text-[30px]"
                  to="/hq"
               >
                  mana
               </Link>
               <div className="relative z-10 flex items-center gap-3">
                  <DarkModeToggle />
                  <Link
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
                laptop:auto-cols-[86px_86px_1fr_334px] laptop:grid-flow-col
                desktop:auto-cols-[86px_220px_1fr_334px]"
         >
            <section
               className="bg-1 border-color relative top-0 z-10
               max-laptop:fixed max-laptop:w-full laptop:border-r"
            >
               <div
                  className="top-14 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
               laptop:h-full laptop:w-[86px] laptop:overflow-y-auto laptop:pt-4"
               >
                  <LoggedOut>
                     <div className="relative flex items-center justify-center pb-3">
                        <NavLink
                           className="bg-2 shadow-1 shadow-1 rounded-full shadow-sm"
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
                                       options="fit=crop,width=88,height=88,gravity=auto"
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
                                 className="bg-2 shadow-1 shadow-1 rounded-full shadow-sm"
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
                                             options="fit=crop,width=88,height=88,gravity=auto"
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
                                             reloadDocument={
                                                // Reload if custom site, but NOT if current site is custom
                                                item.type == "custom" &&
                                                site.type != "custom" &&
                                                true
                                             }
                                             className="bg-2 shadow-1 shadow-1 rounded-full shadow-sm"
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
                                                         options="fit=crop,width=88,height=88,gravity=auto"
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
               <div
                  className="bg-1 laptop:bg-2 border-color fixed
                        bottom-0 mx-auto w-full px-4 max-laptop:z-40
                        max-laptop:flex max-laptop:h-12 max-laptop:border-t laptop:top-14
                        laptop:h-full laptop:w-[86px] laptop:space-y-1 laptop:overflow-y-auto
                        laptop:border-r laptop:py-5 desktop:w-[220px] desktop:pl-5 desktop:pr-6"
               >
                  <NavLink
                     end
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-blue-100 bg-blue-50 text-zinc-600 
                               dark:border-blue-900/50 dark:bg-[#1d2b52] dark:text-white 
                            `
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.slug}`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <HomeIconBold className="h-5 w-5 text-blue-500" />
                           ) : (
                              <HomeIcon className="h-5 w-5 text-blue-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Home
                           </span>
                        </>
                     )}
                  </NavLink>
                  <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-emerald-200/50 bg-emerald-50 text-zinc-600 
                            dark:border-emerald-900/50 dark:bg-[#0b372b] dark:text-white 
                         `
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.slug}/posts`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <PencilSquareIconBold className="h-5 w-5 text-emerald-500" />
                           ) : (
                              <PencilSquareIcon className="h-5 w-5 text-emerald-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Posts
                           </span>
                        </>
                     )}
                  </NavLink>
                  <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-yellow-200/50 bg-yellow-50 text-zinc-600 
                         dark:border-yellow-900/50 dark:bg-[#48311d] dark:text-white 
                      `
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.slug}/collections`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <CircleStackIconBold className="h-5 w-5 text-yellow-500" />
                           ) : (
                              <CircleStackIcon className="h-5 w-5 text-yellow-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Collections
                           </span>
                        </>
                     )}
                  </NavLink>
                  {/* <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-violet-100 bg-violet-50 text-zinc-600 
                               dark:border-violet-900/50 dark:bg-[#352b46] dark:text-white 
                                 `
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.slug}/questions`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <ChatBubbleLeftIconBold className="h-5 w-5 text-violet-500" />
                           ) : (
                              <ChatBubbleLeftIcon className="h-5 w-5 text-violet-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Discussions
                           </span>
                        </>
                     )}
                  </NavLink> */}
               </div>
            </section>
            <section
               className="max-laptop:border-color bg-3 max-laptop:min-h-screen
               max-laptop:border-b"
            >
               <section
                  className="sticky z-40 max-laptop:top-[56px] laptop:top-6 
               laptop:z-50 laptop:px-3"
               >
                  <div
                     className="border-color bg-2 shadow-1 relative mx-auto flex 
                     h-16 w-full items-center justify-between border-b pl-2 pr-3
                     shadow-sm laptop:max-w-[736px] laptop:rounded-xl laptop:border"
                  >
                     {searchToggle ? (
                        <SearchComboBox
                           siteType={site.type}
                           setSearchToggle={setSearchToggle}
                        />
                     ) : (
                        <>
                           <Link
                              to={`/${site.slug}`}
                              className="hover:bg-3 flex items-center gap-3 truncate rounded-full p-1 pr-4 font-bold"
                           >
                              <div className="h-8 w-8 flex-none overflow-hidden rounded-full bg-zinc-200">
                                 <Image
                                    //@ts-expect-error
                                    url={site.icon?.url}
                                    options="fit=crop,width=60,height=60,gravity=auto"
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
                                       reloadDocument={
                                          site.type != "custom" && true
                                       }
                                       to={`/login?redirectTo=/${site.slug}`}
                                       className="flex h-9 items-center justify-center rounded-full bg-zinc-700
                               px-3.5 text-sm font-bold text-white dark:bg-white dark:text-black"
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
                                 className="bg-3 border-color shadow-1 flex h-10 w-10 items-center justify-center
                                   rounded-full border shadow-sm"
                                 onClick={() => {
                                    setSearchToggle(true);
                                 }}
                              >
                                 <Search size={20} />
                              </button>
                           </div>
                        </>
                     )}
                  </div>
               </section>
               <Outlet />
            </section>
            {/* Right Sidebar */}
            <section
               className="bg-2 border-color relative z-20 max-laptop:mx-auto
               max-laptop:max-w-[728px] max-laptop:pb-20 tablet:border-x laptop:block laptop:border-l laptop:border-r-0"
            >
               <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <div className="divide-color flex-grow divide-y laptop:pt-14">
                     {site.about && (
                        <section className="p-4">
                           <div className="flex items-center gap-1.5 pb-2.5">
                              <Component size={14} />
                              <span className="text-1 text-sm font-bold">
                                 About
                              </span>
                           </div>
                           <div className="text-1 text-sm">{site.about}</div>
                        </section>
                     )}
                     {site.pinned && (
                        <>
                           <section className="p-4">
                              <div className="flex items-center gap-1.5 pb-2.5">
                                 <Pin size={14} />
                                 <span className="text-1 text-sm font-bold">
                                    Pinned
                                 </span>
                              </div>
                              <ul className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
                                 {site.pinned?.map((item: any) => (
                                    <li key={item.id}>
                                       <Link
                                          className="bg-3 shadow-1 border-color relative block rounded-lg border p-3 shadow-sm"
                                          prefetch="intent"
                                          to={pinnedLinkUrlGenerator(
                                             item,
                                             site.slug
                                          )}
                                       >
                                          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center">
                                             {item.relation?.value?.icon
                                                ?.url ? (
                                                <Image
                                                   url={
                                                      item.relation?.value?.icon
                                                         ?.url
                                                   }
                                                   options="fit=crop,width=100,height=100,gravity=auto"
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
                                          {item?.label && (
                                             <span
                                                className="absolute -right-1 -top-1 flex h-4 items-center justify-center rounded-full 
                                             bg-blue-500 px-1.5 text-[8px] uppercase text-white"
                                             >
                                                {item?.label}
                                             </span>
                                          )}
                                       </Link>
                                    </li>
                                 ))}
                              </ul>
                           </section>
                        </>
                     )}
                     <section className="border-color px-4 py-5 laptop:!border-b">
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
                                                options="fit=crop,width=100,height=100,gravity=auto"
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
                                             options="fit=crop,width=100,height=100,gravity=auto"
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
                  </div>
                  <div className="border-color flex items-center justify-center border-t py-4">
                     <div className="bg-1 h-[250px] w-[300px] rounded-lg" />
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
