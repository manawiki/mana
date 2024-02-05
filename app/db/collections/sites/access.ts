import type { Access, FieldAccess } from "payload/types";

import type { User } from "payload/generated-types";

import { isSiteAdmin } from "../../access/isSiteAdmin";
import { isSiteOwner } from "../../access/isSiteOwner";
import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";
import { isSiteStaff } from "../../access/isSiteStaff";

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

export const canReadSite: Access = async ({ req: { user, payload }, id }) => {
   if (!user)
      return {
         isPublic: {
            equals: true,
         },
      };

   if (user && user.roles.includes("staff")) return true;

   //Singleton
   if (user && id) {
      const site = await payload.findByID({
         collection: "sites",
         id,
         depth: 0,
      });
      const hasAccess = isSiteOwnerOrAdmin(user.id, site);

      if (!hasAccess)
         return {
            isPublic: {
               equals: true,
            },
         };
      return hasAccess;
   }
   //List
   return {
      isPublic: {
         equals: true,
      },
   };
};

export const canUpdateSiteRoles: FieldAccess = async ({
   req: { user },
   data,
   doc,
}) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;

      const newAdminData = data?.admins ?? [];
      const existingAdminData = doc.admins ?? [];

      const siteOwner = doc.owner;
      const isOwner = isSiteOwner(user?.id, siteOwner);
      const isAdmin = isSiteAdmin(user?.id, existingAdminData as any[]);

      const adminChange = newAdminData.length !== existingAdminData.length;

      //promote to admin from contributor
      if (newAdminData.length > existingAdminData.length && adminChange) {
         return isOwner;
      }
      return isOwner || isAdmin;
   }
   // Reject everyone else
   return false;
};
