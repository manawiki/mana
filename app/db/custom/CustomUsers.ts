import type { CollectionConfig } from "payload/types";

import {
   isStaff,
   isStaffFieldLevel,
   isStaffOrSelfFieldLevel,
} from "../collections/users/users.access";

export const Users: CollectionConfig = {
   slug: "users",
   auth: {
      useAPIKey: true,
   },
   access: {
      read: isStaff,
      create: isStaff,
      delete: isStaff,
      update: isStaff,
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
      {
         name: "apiKey",
         type: "text",
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
      {
         name: "enableAPIKey",
         type: "text",
         access: {
            read: isStaffOrSelfFieldLevel,
         },
      },
   ],
};
