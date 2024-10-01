import type { CollectionConfig } from "payload/types";
import {
   afterChangeSearchSyncHook,
   afterDeleteSearchSyncHook,
} from "../hooks/search-hooks";
import { isStaff } from "../../db/collections/users/users.access";

export const Cards: CollectionConfig = {
   slug: "cards",
   labels: { singular: "Card", plural: "Cards" },
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
   hooks: {
      afterDelete: [afterDeleteSearchSyncHook],
      afterChange: [afterChangeSearchSyncHook],
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "slug",
         type: "text",
         required: true,
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
         required: true,
      },
   ],
};
