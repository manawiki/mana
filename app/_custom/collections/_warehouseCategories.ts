import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _WarehouseCategories: CollectionConfig = {
   slug: "_warehouseCategories",
   labels: { singular: "_warehouseCategory", plural: "_warehouseCategories" },
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
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
