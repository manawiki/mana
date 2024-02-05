import type { Site } from "payload/generated-types";
import type { PostData } from "~/routes/_site+/p+/utils/fetchPostWithSlug.server";

export function isSiteOwnerOrAdmin(
   userId: string,
   site: Site | undefined | null | PostData["site"],
) {
   const siteAdmins = site?.admins;
   const siteOwner = site?.owner;
   const isSiteOwner = userId == (siteOwner as any);
   //@ts-ignore
   const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
   if (isSiteOwner || isSiteAdmin) return true;
   return false;
}
