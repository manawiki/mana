import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canDeleteImages } from "./access";
import { isStaff, isStaffFieldLevel, isStaffOrSelf } from "../users/access";

export const imagesSlug = "images";
export const Images: CollectionConfig = {
   slug: imagesSlug,
   access: {
      read: (): boolean => true, // Everyone can read Images
      update: isStaff,
      delete: canDeleteImages,
      create: isStaffOrSelf,
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
         type: "relationship",
         relationTo: "sites",
         maxDepth: 1,
         hasMany: false,
      },
   ],
};
