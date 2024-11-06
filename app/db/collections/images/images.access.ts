import type { Access } from "payload/types";

import { isSiteStaff } from "../../access/isSiteStaff";

//@ts-ignore
export const canDeleteImages: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         or: [
            {
               createdBy: { equals: user.id },
            },
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

export const canCreateImage: Access = async ({ req: { user }, data }) => {
   const isSelf = user?.id === data?.createdBy;
   const isStaff = user?.roles?.includes("staff");
   return isStaff || isSelf;
};
