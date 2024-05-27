import { useLoaderData } from "@remix-run/react";

import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { SideMenu } from "./sidemenu/SideMenu";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { ViewSideMenu } from "./sidemenu/ViewSideMenu";
import { NotAdminOrStaffOrOwner } from "~/routes/_auth+/components/NotAdminOrStaffOrOwner";
import { PrimaryMenu } from "./PrimaryMenu";

export function ColumnTwo() {
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
               <div className="pt-2.5 mb-0 fixed h-[178px] w-[59px] desktop:w-[229px] bg-2 z-10 flex flex-col justify-between">
                  <PrimaryMenu isSidebar />
                  {site.menu && site.menu.length > 0 && (
                     <div className="border-dotted border-t-2 border-zinc-200/80 dark:border-zinc-700 mx-4" />
                  )}
               </div>
               <div className="pt-[178px]">
                  <AdminOrStaffOrOwner>
                     <SideMenu site={site} />
                  </AdminOrStaffOrOwner>
                  <NotAdminOrStaffOrOwner>
                     <ViewSideMenu site={site} />
                  </NotAdminOrStaffOrOwner>
               </div>
            </div>
         </div>
      </section>
   );
}
