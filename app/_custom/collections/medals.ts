import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Medals: CollectionConfig = {
   slug: "medals",
   labels: { singular: "medal", plural: "medals" },
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
         name: "slot_id",
         type: "number",
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "medalTypes",
      },
      {
         name: "set",
         type: "relationship",
         relationTo: "medalSets",
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
