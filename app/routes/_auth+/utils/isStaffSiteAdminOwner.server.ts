import type { User, Site } from "payload/generated-types";

/**
 * Checks if the user is a staff member, site admin, or the owner of the site.
 *
 * @param user - The user object.
 * @param site - The site object.
 * @returns A boolean indicating whether the user is a staff member, site admin, or the owner of the site.
 */

export function isStaffOrSiteAdminOrStaffOrOwnerServer(
   user: User | undefined,
   site: Site,
) {
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
