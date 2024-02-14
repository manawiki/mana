import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const skinBrands: CollectionConfig = {
   slug: "skinBrands",
   labels: { singular: "skinBrand", plural: "skinBrands" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "description",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
