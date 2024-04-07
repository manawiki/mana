import type { CollectionConfig } from "payload/types";

import {
   isStaff,
   isStaffFieldLevel,
   isStaffOrSelf,
} from "../collections/users/access";
export const Users: CollectionConfig = {
   slug: "users",
   auth: true,
   access: {
      read: () => true,
      create: () => true,
      delete: isStaff,
      update: isStaffOrSelf,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "roles",
         saveToJWT: true,
         type: "select",
         hasMany: true,
         defaultValue: ["user"],
         access: {
            create: isStaffFieldLevel,
            update: isStaffFieldLevel,
         },
         options: [
            {
               label: "Staff",
               value: "staff",
            },
            {
               label: "User",
               value: "user",
            },
         ],
      },
      {
         name: "email",
         type: "email",
         label: "User email",
         required: true,
         unique: true,
         access: {
            read: isStaffFieldLevel,
         },
      },
   ],
};
