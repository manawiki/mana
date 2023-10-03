import { useMatches, useRouteLoaderData } from "@remix-run/react";

import { settings } from "mana-config";
import type { User, Site } from "payload/generated-types";

export const handleLogout = async () => {
   void (await fetch(`${settings.domainFull}/api/users/logout`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
   }));
   location.reload();
};

export const useIsStaffOrSiteAdminOrStaffOrOwner = () => {
   const { user } = useRouteLoaderData("root") as { user: User };

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const  { site } = useMatches()?.[1]?.data as {site: Site | null} ?? {site: null}; 

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

export const isStaffOrSiteAdminOrStaffOrOwnerServer = (
   user: User | undefined,
   site: Site
) => {
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
