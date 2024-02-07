// User specific permissions
import type { Access, FieldAccess } from "payload/types";

import type { User } from "payload/generated-types";

export const isLoggedIn: Access = ({ req: { user } }) => {
   // Return true if user is logged in, false if not
   return Boolean(user);
};

export const isStaff: Access = ({ req: { user } }) => {
   // Return true or false based on if the user has a staff role
   return Boolean(user?.roles?.includes("staff"));
};

export const isStaffFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
   req: { user },
}) => {
   // Return true or false based on if the user has an staff role
   return Boolean(user?.roles?.includes("staff"));
};

export const isStaffOrSelf: Access = ({ req: { user } }) => {
   if (user) {
      if (user?.roles?.includes("staff")) {
         return true;
      }
      // If any other type of user, only provide access to themselves
      return {
         id: {
            equals: user.id,
         },
      };
   }
   // Reject everyone else
   return false;
};
