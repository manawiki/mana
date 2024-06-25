import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { isStaff, isStaffFieldLevel } from "../collections/users/users.access";

export const CustomImages: CollectionConfig = {
   slug: "images",
   access: {
      read: (): boolean => true, // Everyone can read Images
      update: isStaff,
      delete: isStaff,
      create: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            read: isStaffFieldLevel,
            update: isStaffFieldLevel,
         },
      },
      {
         name: "site",
         type: "text",
      },
   ],
};
