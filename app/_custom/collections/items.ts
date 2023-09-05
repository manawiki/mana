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
         relationTo: "_warehouseCategories",
      },
      // TODO(dim): Do we?
      //{
      //   name: "type",
      //   type: "relationship",
      //   relationTo: "_itemTypes",
      //},
      // TODO(dim): Merge somehow? item and dolls rarity are different, but having two collections might be not intuitive.
      //{
      //   name: "rarity",
      //   type: "relationship",
      //   relationTo: "_rarities",
      //},
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
