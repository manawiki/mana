import type { Access, FieldAccess } from "payload/types";

import { isSiteAdmin } from "../../access/isSiteAdmin";
import { isSiteOwner } from "../../access/isSiteOwner";
import { isSiteStaff } from "../../access/isSiteStaff";

//@ts-ignore
export const canEditSite: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         or: [
            {
               owner: {
                  equals: user.id,
               },
            },
            {
               admins: {
                  contains: user.id,
               },
            },
         ],
      };
   }
   // Reject everyone else
   return false;
};

//@ts-ignore
export const canReadSite: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         or: [
            {
               isPublic: {
                  equals: true,
               },
            },
            {
               owner: {
                  equals: user.id,
               },
            },
            {
               admins: {
                  contains: user.id,
               },
            },
            {
               contributors: {
                  contains: user.id,
               },
            },
         ],
      };
   }
   return {
      isPublic: {
         equals: true,
      },
   };
};

export const canUpdateSiteRolesField: FieldAccess = async ({
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

      //Only site owners can promote to admin from contributor
      if (newAdminData.length > existingAdminData.length && adminChange) {
         return isOwner;
      }
      return isOwner || isAdmin;
   }
   // Reject everyone else
   return false;
};
