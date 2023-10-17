import { Fragment, useState } from "react";

import { Menu, Transition } from "@headlessui/react";
import { Link, Outlet } from "@remix-run/react";
import {
   Loader2,
   LogOut,
   MenuIcon,
   Search,
   Settings2,
   Users2,
   X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Image } from "~/components";
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
            <section className="z-40 w-full laptop:z-50 fixed max-laptop:top-[56px] laptop:sticky laptop:top-6">
               <div
                  className="relative mx-auto w-full laptop:max-w-[736px] laptop:rounded-full laptop:border border-color bg-gradient-to-br dark:from-bg3Dark dark:to-bg2Dark 
                  from-white to-gray-50 border-zinc-200 shadow-1 border-b shadow-sm"
               >
                  <div className="relative mx-auto flex h-[58px] items-center justify-between pl-3 pr-2.5">
                     {searchToggle ? (
                        <SearchComboBox
                           siteType={site.type}
                           setSearchToggle={setSearchToggle}
                        />
                     ) : (
                        <>
                           <div className="flex items-center">
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
                                    <div className="font-bold group-hover:underline decoration-zinc-300 underline-offset-2 dark:decoration-zinc-600">
                                       {site.name}
                                    </div>
                                    <div className="text-[10px] flex items-center gap-1">
                                       <Users2 className="text-1" size={12} />
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
                                                <X
                                                   size={20}
                                                   className={`${
                                                      open && "text-red-500"
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
                                                      <fetcher.Form
                                                         action={`/${site.slug}`}
                                                         method="post"
                                                      >
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
                                                               "follow.actionUnfollow",
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
                                             <Loader2 className="mx-auto h-5 w-5 animate-spin" />
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
                                 <Search size={20} />
                              </button>
                              <button
                                 className="bg-3 border-color shadow-1 flex h-10 w-10 items-center justify-center rounded-full
                                             border shadow-sm transition duration-300 active:translate-y-0.5 laptop:hidden"
                                 aria-label="Menu"
                                 onClick={() => setPrimaryMenuOpen(true)}
                              >
                                 <MenuIcon size={20} />
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
            <div>
               <Outlet />
            </div>
         </section>
      </>
   );
};
