import type { Site } from "payload/generated-types";

//Check if user is a site owner or admin?

export const isSiteOwnerOrAdmin = (
   userId: string,
   site: Site | undefined | null,
) => {
   const siteAdmins = site?.admins;
   const siteOwner = site?.owner;
   const isSiteOwner = userId == (siteOwner as any);
   //@ts-ignore
   const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
   if (isSiteOwner || isSiteAdmin) return true;
   return false;
};
