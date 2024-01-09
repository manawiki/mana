import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Items: CollectionConfig = {
   slug: "items",
   labels: { singular: "item", plural: "items" },
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
         name: "category",
         type: "relationship",
         relationTo: "warehouseCategories",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "obtain",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
