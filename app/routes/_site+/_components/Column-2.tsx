import { useEffect, useState } from "react";

import { useLoaderData, useLocation } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { PrimaryMenu } from "./PrimaryMenu";
import { SideMenu } from "./sidemenu/SideMenu";
import { ViewSideMenu } from "./sidemenu/ViewSideMenu";

export function ColumnTwo({
   setPrimaryMenuOpen,
   isPrimaryMenu,
}: {
   setPrimaryMenuOpen: (open: boolean) => void;
   isPrimaryMenu: boolean;
}) {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

   const [editMode, setEditMode] = useState(false);
   let { pathname } = useLocation();

   //Close menu after path change
   useEffect(() => {
      if (isPrimaryMenu) {
         setPrimaryMenuOpen(false);
      }
   }, [pathname]);

   return (
      <section className="bg-2 border-color shadow-1 z-50 border-r laptop:shadow-sm laptop:shadow-1">
         <div
            className="fixed bottom-0 flex flex-col top-0 z-50 mx-auto h-full overflow-y-auto shadow-sm  
            max-laptop:hidden laptop:w-[60px] desktop:w-[229px] pb-28
            dark:scrollbar-thumb-dark500 dark:scrollbar-track-bg2Dark
            scrollbar-thumb-zinc-200 scrollbar-track-zinc-50 scrollbar"
         >
            <div className="flex-grow">
               <div className="fixed h-[174px] w-[59px] desktop:w-[229px] bg-2 z-10 flex flex-col justify-between">
                  <PrimaryMenu isSidebar />
                  <div className="border-dotted border-t-2 border-zinc-200/80 dark:border-zinc-700 mx-4" />
               </div>
               <div className="pt-[186px] desktop:pt-[176px] group">
                  <button
                     className="transition duration-300 active:translate-y-0.5 desktop:hidden mx-auto flex items-center 
                     justify-center dark:bg-dark450 dark:hover:bg-dark500 bg-zinc-200/50 hover:bg-zinc-200 size-8 rounded-md"
                     aria-label="Menu"
                     onClick={() => setPrimaryMenuOpen(true)}
                  >
                     <Icon name="menu" size={14} className="text-1" />
                  </button>
                  <div className="max-desktop:hidden relative group">
                     <AdminOrStaffOrOwner>
                        {editMode ? (
                           <SideMenu setEditMode={setEditMode} site={site} />
                        ) : (
                           <>
                              {site?.menu && site?.menu?.length > 0 ? (
                                 <button
                                    className="size-6 absolute top-3 z-20 right-1.5 group group-hover:block hidden"
                                    onClick={() => setEditMode(true)}
                                 >
                                    <Icon
                                       className="dark:text-zinc-500 text-zinc-400 dark:group-hover:text-zinc-400 group-hover:text-zinc-500"
                                       name="pencil"
                                       size={12}
                                    />
                                 </button>
                              ) : (
                                 <button
                                    className="flex items-center gap-2 text-1 text-xs p-2 pr-2.5 ml-2.5 mt-2.5 hover:bg-zinc-100 rounded-lg dark:hover:bg-dark400"
                                    onClick={() => setEditMode(true)}
                                 >
                                    <Icon
                                       className="dark:text-zinc-500 text-zinc-400 dark:group-hover:text-zinc-400 group-hover:text-zinc-500"
                                       name="square-plus"
                                       size={14}
                                    />
                                    Add menu
                                 </button>
                              )}
                              <ViewSideMenu site={site} />
                           </>
                        )}
                     </AdminOrStaffOrOwner>
                     <NotAdminOrStaffOrOwner>
                        <ViewSideMenu site={site} />
                     </NotAdminOrStaffOrOwner>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
