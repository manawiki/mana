import type { Access, Where, FieldAccess } from "payload/types";
import type { User } from "payload/generated-types";

export const authenticatedAndStaff: Access = ({ req: { user } }) =>
   user && user?.roles?.includes("staff");

export const pageIsPublic = (): Where => ({
   public: {
      equals: true,
   },
});

export const isLoggedIn: Access = ({ req: { user } }) => {
   // Return true if user is logged in, false if not
   return Boolean(user);
};

export const isStaff: Access = ({ req: { user } }) => {
   // Return true or false based on if the user has a staff role
   return Boolean(user?.roles?.includes("staff"));
};

export const isStafforUser =
   (userField = "user"): Access =>
   ({ req: { user } }) => {
      // Return true or false based on if the user has a staff role
      if (user?.roles?.includes("staff")) return true;

      // using a query constraint, we can restrict it based on the `user` field
      if (user)
         return {
            [userField]: {
               equals: user?.id,
            },
         };

      return false;
   };
export const isStafforUserorPublished =
   (userField = "user"): Access =>
   ({ req: { user } }) => {
      // Return true or false based on if the user has an staff role
      if (user?.roles?.includes("staff")) return true;

      // using a query constraint, we can restrict it based on the `user` field
      if (user)
         return {
            or: [
               {
                  [userField]: {
                     equals: user?.id,
                  },
               },
               {
                  _status: {
                     equals: "published",
                  },
               },
               {
                  _status: {
                     equals: false,
                  },
               },
            ],
         };

      //otherwise return published version only
      return {
         or: [
            {
               _status: {
                  equals: "published",
               },
            },
            {
               _status: {
                  equals: false,
               },
            },
         ],
      };
   };

export const isStaffFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
   req: { user },
}) => {
   // Return true or false based on if the user has an staff role
   //@ts-ignore
   return Boolean(user?.roles?.includes("staff"));
};

export const isStaffOrHasSiteAccess =
   (siteIDFieldName = "site"): Access =>
   ({ req: { user } }) => {
      // Need to be logged in
      if (user) {
         // If user has role of 'admin'
         if (user?.roles?.includes("staff")) return true;

         // If user has role of 'user' and has access to a site,
         // return a query constraint to restrict the documents this user can edit
         // to only those that are assigned to a site, or have no site assigned
         if (user?.roles?.includes("user") && user.sites?.length > 0) {
            // Otherwise, we can restrict it based on the `site` field
            return {
               or: [
                  {
                     [siteIDFieldName]: {
                        in: user.sites,
                     },
                  },
                  {
                     [siteIDFieldName]: {
                        exists: false,
                     },
                  },
               ],
            };
         }
      }

      // Reject everyone else
      return false;
   };

export const isStaffOrSelf: Access = ({ req: { user } }) => {
   // Need to be logged in
   if (user) {
      // If user has role of 'admin'
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

export const isStaffOrSiteOwnerOrSiteAdmin =
   (siteIDFieldName = "site"): Access =>
   ({ req: { user } }) => {
      if (user) {
         if (user.roles.includes("staff")) return true;
         if (user.roles.includes("user") && user.sites?.length > 0) {
            // Otherwise, we can restrict it based on the `site` field
            return {
               or: [
                  {
                     [siteIDFieldName]: {
                        in: user.sites,
                     },
                  },
                  {
                     [siteIDFieldName]: {
                        exists: false,
                     },
                  },
               ],
            };
         }
      }
      // Reject everyone else
      return false;
   };
