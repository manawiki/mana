import type { User, Site } from "payload-types";
import { useRouteLoaderData } from "@remix-run/react";

export const useIsStaffOrSiteAdminOrStaffOrOwner = () => {
   const { user } = useRouteLoaderData("root") as { user: User };
   const { site } =
      (useRouteLoaderData("routes/$siteId") as { site: Site }) || {};

   //always false if not logged in
   if (!user || !user?.id) return false;

   // return true if user is Mana Admin
   if (user?.roles?.includes("staff")) return true;

   // return true if user is site owner
   if (
      typeof site?.owner === "string"
         ? site?.owner === user.id
         : site?.owner?.id === user.id
   )
      return true;

   // return true if user is site admin
   if (site?.admins?.some((e: any) => e.id === user.id)) return true;

   // return false if none of the above
   return false;
};

export * from "./components";
