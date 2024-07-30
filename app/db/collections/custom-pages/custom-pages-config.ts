import type { CollectionConfig } from "payload/types";

import {
   customPagesAfterChangeHook,
   customPagesAfterDeleteHook,
} from "./custom-pages-hooks";
import { isStaff } from "../users/users.access";

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
   hooks: {
      afterDelete: [customPagesAfterDeleteHook],
      afterChange: [customPagesAfterChangeHook],
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
         required: true,
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
         maxDepth: 1,
      },
   ],
};
