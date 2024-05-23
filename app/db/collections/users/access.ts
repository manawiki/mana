// User specific permissions
import type { Access, FieldAccess } from "payload/types";

import type { User } from "payload/generated-types";

// Return true if user is logged in, false if not
export const isLoggedIn: Access<User, User> = ({ req: { user } }) => {
   return Boolean(user);
};

// Return true if the user has a mana staff role
export const isStaff: Access<User, User> = ({ req: { user } }) => {
   return Boolean(user?.roles?.includes("staff"));
};

// This work because the document id here is the user being accessed
export const isSelf: Access<User, User> = ({ req: { user }, id }) => {
   return user?.id === id;
};

export const isStaffOrSelf: Access<User, User> = (props) =>
   isStaff(props) || isSelf(props);

export const isStaffFieldLevel: FieldAccess<User, User, User> = ({
   req: { user },
}) => {
   return Boolean(user?.roles?.includes("staff"));
};

//Field level types, main difference here is you need to get the user.id from doc instead
export const isSelfFieldLevel: FieldAccess<User, unknown, User> = ({
   req,
   doc,
}) => {
   return req.user?.id === doc?.id;
};

export const isStaffOrSelfFieldLevel: FieldAccess<User, unknown, User> = (
   props,
) => isStaffFieldLevel(props) || isSelfFieldLevel(props);
