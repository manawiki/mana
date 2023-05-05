import { isStaffFieldLevel } from "../access";
import type { User } from "payload/generated-types";
import type { CollectionConfig } from "payload/types";

export const imagesSlug = "images";
export const Images: CollectionConfig = {
   slug: imagesSlug,
   access: {
      read: (): boolean => true, // Everyone can read Images
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         required: true,
         defaultValue: ({ user }: { user: User }) => user.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 1,
      },
   ],
};
