import type { CollectionConfig } from "payload/types";
import {
  authenticatedAndAdmin,
  isAdminFieldLevel,
  isAdminOrSelf,
} from "../access";
import { serverEnv, domainCookie } from "../../shared";

export const usersSlug = "users";
export const Users: CollectionConfig = {
  slug: usersSlug,
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url =
          serverEnv == "local"
            ? `http://localhost:3000/verify?token=${token}`
            : serverEnv == "dev-server"
            ? `https://manatee.wiki/verify?token=${token}`
            : `https://mana.wiki/verify?token=${token}`;

        return `Hey ${user.email}, verify your email by clicking here: ${url}`;
      },
    },
    cookies: {
      domain: domainCookie,
      secure: serverEnv == "local" ? false : true,
      sameSite: serverEnv == "local" ? "lax" : "none",
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAdminOrSelf,
    create: () => true,
    delete: authenticatedAndAdmin,
    update: isAdminOrSelf,
  },
  fields: [
    {
      name: "username",
      type: "text",
      unique: true,
    },
    {
      name: "roles",
      saveToJWT: true,
      type: "select",
      hasMany: true,
      defaultValue: ["user"],
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
    {
      name: "sites",
      saveToJWT: true,
      type: "relationship",
      relationTo: "sites",
      hasMany: true,
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "images",
    },
  ],
};
