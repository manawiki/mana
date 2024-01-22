import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { isStaff, isStaffFieldLevel } from "../../access/user";

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
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 1,
      },
      {
         name: "site",
         type: "text",
      },
   ],
};
