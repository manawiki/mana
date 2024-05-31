import type { Access } from "payload/types";

import { isSiteStaff } from "../../access/isSiteStaff";

//@ts-ignore
export const canReadUserData: Access = async ({ req: { user } }) => {
   return {
      author: { equals: user.id },
   };
};

export const canCreateUserData: Access = async ({ req: { user } }) => {
   return {
      author: { equals: user.id },
   };
};

//@ts-ignore
export const canDeleteUserData: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         author: { equals: user.id },
      };
   }
   // Reject everyone else
   return false;
};

//@ts-ignore
export const canUpdateUserData: Access = async ({ req: { user } }) => {
   if (user) {
      const isStaff = isSiteStaff(user?.roles);
      if (isStaff) return true;
      return {
         author: { equals: user.id },
      };
   }
   // Reject everyone else
   return false;
};
