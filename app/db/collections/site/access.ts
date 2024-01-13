import type { Access, FieldAccess } from "payload/types";

import type { Site, User } from "payload/generated-types";

//Check if user is a site owner or admin?
export const isSiteOwnerOrAdmin = (userId: string, site: Site | undefined) => {
   const siteAdmins = site?.admins;
   const siteOwner = site?.owner;
   const isSiteOwner = userId == (siteOwner as any);
   //@ts-ignore
   const isSiteAdmin = siteAdmins && siteAdmins.includes(userId);
   if (isSiteOwner || isSiteAdmin) return true;
   return false;
};

export const isSiteOwner = (
   userId: string,
   siteOwner: Site["owner"] | undefined,
) => {
   const isSiteOwner = userId == (siteOwner as any);
   if (isSiteOwner) return true;
   return false;
};

export const siteFieldAsSiteAdmin: FieldAccess<
   { id: string },
   unknown,
   User
> = async ({ req: { user, payload }, id, data }) => {
   if (user) {
      if (user?.roles?.includes("staff")) return true;
      const userId = user?.id;

      // Read and Update
      if (id) {
         const item = await payload.findByID({
            collection: "sites",
            id,
            depth: 0,
         });
         if (item) return isSiteOwnerOrAdmin(userId, item);
      }
   }

   // Reject everyone else
   return false;
};

export const canEditSite: Access = async ({
   req: { user, payload },
   id: resultId,
   data,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;
      // Update and Delete
      if (resultId) {
         const site = await payload.findByID({
            collection: "sites",
            id: resultId,
            depth: 0,
         });
         if (site) return isSiteOwnerOrAdmin(userId, site);
      }
      // Create
      if (data) {
         const site = await payload.findByID({
            collection: "sites",
            id: data.site,
            depth: 0,
         });
         return isSiteOwnerOrAdmin(userId, site);
      }
   }
   // Reject everyone else
   return false;
};

export const canReadSite: Access = async ({
   req: { user, payload },
   id: resultId,
}) => {
   if (user) {
      if (user.roles.includes("staff")) return true;
      const userId = user.id;
      if (resultId) {
         const site = await payload.findByID({
            collection: "sites",
            id: resultId,
            depth: 0,
         });
         if (site) return isSiteOwnerOrAdmin(userId, site);
      }
   }
   return {
      isPublic: {
         equals: true,
      },
   };
};
