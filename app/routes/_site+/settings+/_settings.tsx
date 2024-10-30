import { redirect } from "@remix-run/node";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { isSiteOwnerOrAdmin } from "~/db/access/isSiteOwnerOrAdmin";

import { SettingsMenuLink } from "./components/SettingsMenuLink";
import { getSiteSlug } from "../_utils/getSiteSlug.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);
   const path = request.url.split("?")[0];
   if (!user) throw redirect(`?redirectTo=/${path}`, 404);
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
   if (!hasAccess) throw redirect(`?redirectTo=/${path}`, 404);
   return null;
}
export default function Settings() {
   return (
      <div className="">
         <div
            className="bg-3 z-10 sticky top-[61px] laptop:top-[61px] dark:bg-bg2Dark
            border-b-2 border-color dark:bg-dark300 bg-zinc-50 h-12 max-tablet:px-3"
         >
            <div className="flex items-center gap-4 font-semibold overflow-y-hidden text-sm overflow-x-auto relative max-w-[728px] mx-auto laptop:w-[728px] h-12">
               <SettingsMenuLink
                  text="Site"
                  to="/settings/site"
                  icon="component"
               />
               <SettingsMenuLink text="Team" to="/settings/team" icon="users" />
               <SettingsMenuLink
                  text="Domain"
                  to="/settings/domain"
                  icon="globe"
               />
               <SettingsMenuLink
                  text="Payouts"
                  to="/settings/payouts"
                  icon="wallet-2"
               />
            </div>
         </div>
         <main className="max-w-[728px] laptop:w-[728px] py-6 laptop:pb-20 max-tablet:px-3 mx-auto">
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
