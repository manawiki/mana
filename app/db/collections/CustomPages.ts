import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";
export const CustomPages: CollectionConfig = {
   slug: "customPages",
   access: {
      read: () => true,
      create: isStaff,
      delete: isStaff,
      update: isStaff,
   },
   admin: {
      useAsTitle: "name",
      defaultColumns: ["name"],
   },
   fields: [
      {
         name: "name",
         type: "text",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 0,
      },
   ],
};
