import type { Access } from "payload/types";

import { isSiteOwnerOrAdmin } from "../site/access";

export const canReadApplication: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user.roles.includes("staff")) return true;

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
            createdBy: {
               equals: user.id,
            },
         };
      return hasAccess;
   }

   //List
   return {
      createdBy: {
         equals: user.id,
      },
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

export const canUpdateApplication: Access = async ({
   req: { user, payload },
   id,
}) => {
   return {
      createdBy: {
         equals: user.id,
      },
   };
};

export const canDeleteApplication: Access = async ({
   req: { user, payload },
   id,
}) => {
   if (user.roles.includes("staff")) return true;

   return {
      createdBy: {
         equals: user.id,
      },
   };
};
