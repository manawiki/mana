import type { Access } from "payload/types";

import { isSiteAdmin } from "../../access/isSiteAdmin";
import { isSiteOwner } from "../../access/isSiteOwner";
import { isSiteStaff } from "../../access/isSiteStaff";

export const canCreatePostTag: Access = async ({
   req: { user, payload },
   data,
}) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;

      if (data) {
         const site = await payload.findByID({
            collection: "sites",
            id: data.site,
            depth: 0,
         });
         const isOwner = isSiteOwner(user?.id, site?.owner as any);
         const isAdmin = isSiteAdmin(user?.id, site?.admins as any[]);

         return isOwner || isAdmin;
      }
   }
   // Reject everyone else
   return false;
};

//@ts-ignore
export const canDeletePostTag: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         or: [
            {
               "site.owner": {
                  equals: user.id,
               },
            },
            {
               "site.admins": {
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
export const canUpdatePostTag: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         or: [
            {
               "site.owner": {
                  equals: user.id,
               },
            },
            {
               "site.admins": {
                  contains: user.id,
               },
            },
         ],
      };
   }
   // Reject everyone else
   return false;
};
