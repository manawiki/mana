import {
   Form,
   Link,
   NavLink,
   Outlet,
   useFetcher,
   useLoaderData,
   useLocation,
} from "@remix-run/react";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import {
   Bell,
   ChevronDown,
   Loader2,
   LogOut,
   Search,
   User,
   X,
} from "lucide-react";
import type {
   ActionFunction,
   LinksFunction,
   LoaderArgs,
   SerializeFrom,
   V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { zx } from "zodix";
import { z } from "zod";
import { assertIsPost, isAdding } from "~/utils";
import {
   FollowingSite,
   LoggedIn,
   LoggedOut,
   NotFollowingSite,
} from "~/modules/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/Image";
import {
   ChatBubbleLeftIcon,
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
   HomeIcon as HomeIconBold,
   PencilSquareIcon as PencilSquareIconBold,
   CircleStackIcon as CircleStackIconBold,
   ChatBubbleLeftIcon as ChatBubbleLeftIconBold,
} from "@heroicons/react/24/solid";
import customStylesheetUrl from "~/_custom/styles.css";
import type { DynamicLinksFunction } from "remix-utils";
import { NewSiteModal } from "~/routes/action+/new-site-modal";

// See https://github.com/payloadcms/payload/discussions/1319 regarding relational typescript support

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   const slug = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteId,
         },
      },
      user,
   });
   const site = slug?.docs[0];
   if (!site) {
      throw json(null, { status: 404 });
   }
   return json({ site });
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: data.site.name,
      },
   ];
};

const dynamicLinks: DynamicLinksFunction<SerializeFrom<typeof loader>> = ({
   data,
}) => {
   //@ts-expect-error
   const icon = data?.site?.icon?.url;
   const faviconUrl = `https://mana.wiki/cdn-cgi/image/fit=crop,height=50,width=50,gravity=auto/${icon}`;
   return [{ rel: "icon", href: faviconUrl }];
};

export const links: LinksFunction = () => {
   return [
      { rel: "preload", href: customStylesheetUrl, as: "style" },
      { rel: "stylesheet", href: customStylesheetUrl },
   ];
};

export const handle = {
   i18n: "site",
   dynamicLinks,
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

   return (
      <>
         <header
            className="bg-1 shadow-1 fixed top-0 z-50 flex
         h-14 w-full items-center justify-between border-b border-zinc-200 
         pl-3 pr-2 shadow-sm dark:border-zinc-800"
         >
            <Link
               className="relative z-10 flex items-center gap-2 pb-0.5 font-logo text-2xl"
               to="/"
            >
               <span>mana</span>
               <span className="text-1 pt-1.5 font-body text-[12px]">beta</span>
            </Link>
            <div className="relative z-10 flex items-center gap-3">
               <DarkModeToggle />
               <div className="laptop:hidden">
                  <NewSiteModal />
               </div>
               <LoggedOut>
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
               </LoggedOut>
               <LoggedIn>
                  <section className="z-50 flex h-14 items-center justify-end gap-5">
                     <Menu as="div" className="relative">
                        <Menu.Button
                           className="bg-3 shadow-1 flex h-10 w-10
                         items-center justify-center rounded-full shadow-sm"
                        >
                           <User size={22} />
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
            </div>

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
               className="bg-1 border-color relative top-14 z-10
               pt-[64px] max-laptop:fixed max-laptop:w-full laptop:border-r"
            >
               <div
                  className="top-14 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
               laptop:h-full laptop:w-[86px] laptop:overflow-y-auto laptop:pt-4"
               >
                  <SiteSwitcher />
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
                  className="border-color sticky z-40 max-laptop:top-[56px] laptop:top-6 
               laptop:z-50 laptop:px-3"
               >
                  <div
                     className="border-color bg-2 shadow-1 mx-auto flex h-16 
                     w-full items-center justify-between border-b pl-2 pr-3 shadow-sm
                     laptop:max-w-[736px] laptop:rounded-xl laptop:border"
                  >
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
                        <div
                           className="bg-3 border-color shadow-1 flex h-10 w-10 items-center justify-center
                           rounded-full border shadow-sm"
                        >
                           <Search size={20} />
                        </div>
                     </div>
                  </div>
               </section>
               <Outlet />
            </section>
            {/* Right Sidebar */}
            <section
               className="bg-2 border-color relative z-20 hidden max-laptop:mx-auto
               max-laptop:max-w-[728px] max-laptop:pb-20 tablet:border-x laptop:block laptop:border-l laptop:border-r-0"
            >
               <div className="flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  <div className="flex-grow"></div>
                  <div className="flex items-center justify-center py-4">
                     <div className="h-[250px] w-[300px]" />
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
      return await payload.update({
         collection: "users",
         id: userId ?? "",
         data: { sites: [...sites, siteId] },
         overrideAccess: false,
         user,
      });
   }

   // Unfollow Site
   if (intent === "unfollow") {
      const userId = user?.id;

      const site = await payload.findByID({
         collection: "sites",
         id: siteId,
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
      const index = sites.indexOf(siteId);
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
