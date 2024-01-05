import { redirect } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { isSiteOwnerOrAdmin } from "~/db/collections/site/access";

import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = getSiteSlug(request);
   if (!user) throw redirect("/404", 404);
   const site = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      depth: 0,
   });
   const hasAccess = isSiteOwnerOrAdmin(user.id, site.docs[0]);
   if (!hasAccess) throw redirect("/404", 404);
   return null;
}
export default function Settings() {
   return (
      <div className="max-laptop:pt-[61px]">
         <div className="bg-3 z-10 sticky top-[117px] laptop:top-[61px] dark:bg-bg2Dark border-b-2 border-color dark:bg-dark300 bg-zinc-50 h-12 max-tablet:px-3">
            <div className="flex items-center gap-4 font-semibold text-sm relative max-w-[728px] mx-auto laptop:w-[728px] h-full">
               <NavLink
                  end
                  to="/settings/site"
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "" : "text-1",
                        "flex items-center relative h-full",
                     )
                  }
               >
                  {({ isActive }) => (
                     <div className="hover:dark:bg-dark400 hover:bg-white hover:shadow-sm flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5">
                        {isActive && (
                           <div className="bg-blue-500 h-[3px] left-1/2 -translate-x-1/2 rounded-sm w-full absolute -bottom-[2px]" />
                        )}
                        <Icon size={14} name="component" className="text-1" />
                        Settings
                     </div>
                  )}
               </NavLink>
               <NavLink
                  end
                  to="/settings/domain"
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "" : "text-1",
                        "flex items-center relative h-full",
                     )
                  }
               >
                  {({ isActive }) => (
                     <div className="hover:dark:bg-dark400 hover:bg-white hover:shadow-sm flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5">
                        {isActive && (
                           <div className="bg-blue-500 h-[3px] left-1/2 -translate-x-1/2 rounded-sm w-full absolute -bottom-[2px]" />
                        )}
                        <Icon size={15} name="globe" className="text-1" />
                        Domain
                     </div>
                  )}
               </NavLink>
               <NavLink
                  end
                  to="/settings/members"
                  className={({ isActive }) =>
                     clsx(
                        isActive ? "" : "text-1",
                        "flex items-center relative h-full",
                     )
                  }
               >
                  {({ isActive }) => (
                     <div className="hover:dark:bg-dark400 hover:bg-white hover:shadow-sm flex items-center gap-2 rounded-lg pl-2 pr-3 py-1.5">
                        {isActive && (
                           <div className="bg-blue-500 h-[3px] left-1/2 -translate-x-1/2 rounded-sm w-full absolute -bottom-[2px]" />
                        )}
                        <Icon size={14} name="user" className="text-1" />
                        Members
                     </div>
                  )}
               </NavLink>
            </div>
         </div>
         <main className="max-w-[728px] laptop:w-[728px] py-6 max-tablet:px-3 mx-auto">
            <Outlet />
         </main>
      </div>
   );
}

export const meta: MetaFunction<typeof loader, any> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   )?.data?.site.name;

   return [
      {
         title: `Settings - ${siteName}`,
      },
   ];
};
