import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";
export const Users: CollectionConfig = {
   slug: "users",
   auth: true,
   access: {
      read: () => true,
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
         name: "slug",
         type: "text",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
      },
   ],
};
