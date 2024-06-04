import { useLoaderData } from "@remix-run/react";

import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { SideMenu } from "./sidemenu/SideMenu";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { ViewSideMenu } from "./sidemenu/ViewSideMenu";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import { PrimaryMenu } from "./PrimaryMenu";
import { Icon } from "~/components/Icon";

export function ColumnTwo({
   setPrimaryMenuOpen,
   isPrimaryMenu,
}: {
   setPrimaryMenuOpen: (open: boolean) => void;
   isPrimaryMenu: boolean;
}) {
   const { site } = useLoaderData<typeof siteLoaderType>() || {};

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
               <div className="pt-[186px] desktop:pt-[176px]">
                  <button
                     className="transition duration-300 active:translate-y-0.5 desktop:hidden mx-auto flex items-center 
                     justify-center dark:bg-dark450 dark:hover:bg-dark500 bg-zinc-200/50 hover:bg-zinc-200 size-8 rounded-md"
                     aria-label="Menu"
                     onClick={() => setPrimaryMenuOpen(true)}
                  >
                     <Icon name="menu" size={14} className="text-1" />
                  </button>
                  <div className="max-desktop:hidden">
                     <AdminOrStaffOrOwner>
                        <SideMenu site={site} />
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
