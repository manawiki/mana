import type { Access, Where, FieldAccess } from "payload/types";
import type { User } from "../../payload-types";

export const authenticatedAndAdmin: Access = ({ req: { user } }) =>
  user && user?.roles?.includes("admin");

export const pageIsPublic = (): Where => ({
  public: {
    equals: true,
  },
});

export const isLoggedIn: Access = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user);
};

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes("admin"));
};

export const isAdminorUser =
  (userField = "user"): Access =>
  ({ req: { user } }) => {
    // Return true or false based on if the user has an admin role
    if (user?.roles?.includes("admin")) return true;

    // using a query constraint, we can restrict it based on the `user` field
    if (user)
      return {
        [userField]: {
          equals: user?.id,
        },
      };

    return false;
  };
export const isAdminorUserorPublished =
  (userField = "user"): Access =>
  ({ req: { user } }) => {
    // Return true or false based on if the user has an admin role
    if (user?.roles?.includes("admin")) return true;

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

export const isAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({
  req: { user },
}) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes("admin"));
};

export const isAdminOrHasSiteAccess =
  (siteIDFieldName = "site"): Access =>
  ({ req: { user } }) => {
    // Need to be logged in
    if (user) {
      // If user has role of 'admin'
      if (user?.roles?.includes("admin")) return true;

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

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user?.roles?.includes("admin")) {
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

export const isAdminOrSiteOwnerOrSiteAdmin =
  (siteIDFieldName = "site"): Access =>
  ({ req: { user } }) => {
    if (user) {
      if (user.roles.includes("admin")) return true;
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
