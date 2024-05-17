import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Namecards: CollectionConfig = {
   slug: "namecards",
   labels: { singular: "namecard", plural: "namecards" },
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
         name: "slug",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "name",
         type: "text",
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
         name: "image",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "fight_desc",
         type: "text",
      },
      {
         name: "obtain_desc",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
