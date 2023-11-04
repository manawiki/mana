import { Fragment, useState } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Link, Outlet } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { Image } from "~/components";
import { Icon } from "~/components/Icon";
import type { Site } from "~/db/payload-types";
import {
   LoggedOut,
   NotFollowingSite,
   FollowingSite,
} from "~/routes/_auth+/src/components";
import { isAdding } from "~/utils";

import { MenuTrayContent, MobileTray } from "./MobileTray";
import SearchComboBox from "../../resource+/Search";

export const ColumnThree = ({
   location,
   searchToggle,
   setSearchToggle,
   fetcher,
   site,
}: {
   location: any;
   searchToggle: any;
   setSearchToggle: any;
   fetcher: any;
   site: Site;
}) => {
   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);
   const [isPrimaryMenu, setPrimaryMenuOpen] = useState(false);

   return (
      <>
         <section className="max-laptop:border-color bg-3 max-laptop:border-b max-laptop:pt-14">
            <section className="z-40 w-full laptop:z-50 fixed max-laptop:top-[56px] laptop:sticky laptop:top-0">
               <div
                  className="relative mx-auto w-full laptop:max-w-[736px] laptop:rounded-b-2xl laptop:border border-color-sub
                dark:bg-dark350 bg-zinc-50 border-zinc-200/70 dark:border-zinc-600/50 shadow-1 border-b shadow-sm laptop:border-t-0"
               >
                  <div className="relative mx-auto flex h-[60px] items-center justify-between pl-3 pr-2.5">
                     {searchToggle ? (
                        <SearchComboBox
                           siteType={site.type}
                           setSearchToggle={setSearchToggle}
                        />
                     ) : (
                        <>
                           <div className="flex items-center truncate">
                              <Link
                                 prefetch="intent"
                                 to={`/${site.slug}`}
                                 className="flex items-center group truncate"
                              >
                                 <div className="shadow-1 h-9 w-9 flex-none overflow-hidden rounded-full shadow">
                                    <Image
                                       width={40}
                                       height={40}
                                       url={site.icon?.url}
                                       options="aspect_ratio=1:1&height=120&width=120"
                                       alt="Site Logo"
                                    />
                                 </div>
                                 <div className="truncate pl-3 text-sm">
                                    <div className="font-bold truncate group-hover:underline decoration-zinc-300 underline-offset-2 dark:decoration-zinc-600">
                                       {site.name}
                                    </div>
                                    <div className="text-[10px] flex items-center gap-1">
                                       <Icon
                                          name="users-2"
                                          className="text-1 w-3 h-3"
                                       />
                                       <span className="dark:text-zinc-500 text-zinc-400">
                                          {site?.followers}
                                       </span>
                                    </div>
                                 </div>
                                 {/* {site.about} */}
                              </Link>
                           </div>
                           <div className="flex items-center gap-3 pl-2">
                              <FollowingSite>
                                 <Menu as="div" className="relative">
                                    {({ open }) => (
                                       <>
                                          <Menu.Button
                                             className="text-1 hover:bg-3 flex h-9 w-9 
                                       items-center justify-center rounded-full transition duration-300 active:translate-y-0.5"
                                          >
                                             {open ? (
                                                <Icon
                                                   name="x"
                                                   className={`${
                                                      open &&
                                                      "tet-zinc-400 dark:text-zinc-500"
                                                   } transition duration-150 ease-in-out w-5 h-5`}
                                                />
                                             ) : (
                                                <>
                                                   <Icon
                                                      name="settings-2"
                                                      className="transition duration-150 ease-in-out w-5 h-5"
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
                                                className="absolute -right-1 z-30 mt-1.5 w-full min-w-[140px]
                                        max-w-md origin-top-right transform transition-all"
                                             >
                                                <div
                                                   className="border-color-sub bg-2-sub shadow-1 rounded-lg border
                                            p-1.5 shadow-sm"
                                                >
                                                   <Menu.Item>
                                                      <fetcher.Form
                                                         action={`/${site.slug}`}
                                                         method="post"
                                                      >
                                                         <button
                                                            name="intent"
                                                            value="unfollow"
                                                            className="text-1 text-xs text-left flex w-full items-center gap-3 rounded-lg
                                                      px-2 py-1.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                         >
                                                            <div className="flex-grow">
                                                               {t(
                                                                  "follow.actionUnfollow",
                                                               )}
                                                            </div>
                                                            <Icon
                                                               size={16}
                                                               name="log-out"
                                                               className="text-zinc-400 w-4.5 h-4.5"
                                                            />
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
                                       reloadDocument={true}
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
                                       action={`/${site.slug}`}
                                    >
                                       <button
                                          name="intent"
                                          value="followSite"
                                          className="flex h-9 items-center justify-center rounded-full bg-black
                                  px-3.5 text-sm font-bold text-white dark:bg-white dark:text-black max-laptop:hidden"
                                       >
                                          {adding ? (
                                             <Icon
                                                name="loader-2"
                                                className="mx-auto h-5 w-5 animate-spin"
                                             />
                                          ) : (
                                             t("follow.actionFollow")
                                          )}
                                       </button>
                                    </fetcher.Form>
                                 </div>
                              </NotFollowingSite>
                              <button
                                 className="bg-3-sub border-color-sub shadow-1 flex h-10 w-10 items-center justify-center
                                   rounded-full border shadow-sm"
                                 aria-label="Search"
                                 onClick={() => {
                                    setSearchToggle(true);
                                 }}
                              >
                                 <Icon name="search" className="w-5 h-5" />
                              </button>
                              <button
                                 className="bg-3-sub border-color-sub shadow-1 flex h-10 w-10 items-center justify-center rounded-full
                                             border shadow-sm transition duration-300 active:translate-y-0.5 laptop:hidden"
                                 aria-label="Menu"
                                 onClick={() => setPrimaryMenuOpen(true)}
                              >
                                 <Icon name="menu" className="w-5 h-5" />
                              </button>
                              <MobileTray
                                 onOpenChange={setPrimaryMenuOpen}
                                 open={isPrimaryMenu}
                              >
                                 <MenuTrayContent
                                    onOpenChange={setPrimaryMenuOpen}
                                    site={site}
                                 />
                              </MobileTray>
                           </div>
                        </>
                     )}
                  </div>
               </div>
            </section>
            <Outlet />
         </section>
      </>
   );
};
