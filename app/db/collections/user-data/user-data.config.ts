import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { isStaffFieldLevel } from "../users/users.access";
import {
   canCreateUserData,
   canDeleteUserData,
   canReadUserData,
   canUpdateUserData,
} from "./user-data.acces";

export const UserData: CollectionConfig = {
   slug: "user-data",
   access: {
      create: canCreateUserData,
      read: canReadUserData,
      update: canUpdateUserData,
      delete: canDeleteUserData,
   },
   fields: [
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         required: true,
         maxDepth: 1,
      },
      {
         name: "data",
         type: "json",
      },
   ],
};
