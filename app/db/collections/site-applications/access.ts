import type { Access, FieldAccess } from "payload/types";

import { isSiteOwnerOrAdmin } from "../../access/isSiteOwnerOrAdmin";
import { isSiteStaff } from "../../access/isSiteStaff";

//@ts-ignore
export const canReadApplication: Access = async ({ req: { user } }) => {
   const isStaff = isSiteStaff(user?.roles);
   if (isStaff) return true;

   return {
      or: [
         {
            createdBy: {
               equals: user.id,
            },
         },
         {
            "site.admins": {
               contains: user.id,
            },
         },
         {
            "site.owner": {
               equals: user.id,
            },
         },
      ],
   };
};

export const canCreateApplication: Access = async ({
   req: { user, payload },
   data,
}) => {
   if (user && data) {
      // Check if the user has already applied to the site
      const existingApplication = await payload.find({
         collection: "siteApplications",
         where: {
            site: {
               equals: data.site,
            },
            createdBy: {
               equals: user.id,
            },
         },
         depth: 0,
      });
      if (existingApplication.totalDocs != 0) return false;
      return true;
   }

   return false;
};

//@ts-ignore
export const canUpdateDeleteApplication: Access = async ({ req: { user } }) => {
   const isStaff = isSiteStaff(user?.roles);
   if (isStaff) return true;

   if (user) {
      return {
         or: [
            {
               createdBy: {
                  equals: user.id,
               },
            },
            {
               "site.admins": {
                  contains: user.id,
               },
            },
            {
               "site.owner": {
                  equals: user.id,
               },
            },
         ],
      };
   }
   return false;
};

export const updateApplicationFieldAsSiteAdmin: FieldAccess = async ({
   req: { user, payload },
   id,
}) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      const userId = user?.id;

      if (id) {
         const application = await payload.findByID({
            collection: "siteApplications",
            id,
            depth: 1,
         });
         if (application.site)
            return isSiteOwnerOrAdmin(userId, application.site);
      }
   }
   return false;
};
