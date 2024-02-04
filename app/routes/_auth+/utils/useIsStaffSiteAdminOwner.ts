import {
   useRootLoaderData,
   useSiteLoaderData,
} from "~/utils/useSiteLoaderData";

/**
 * Determines if the current user is a staff member, site admin, or owner of the site.
 * @returns {boolean} True if the user is a staff member, site admin, or owner; otherwise, false.
 */

export function useIsStaffOrSiteAdminOrStaffOrOwner() {
   const { user } = useRootLoaderData();

   const { site } = useSiteLoaderData();

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
}
