import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Monsters: CollectionConfig = {
   slug: "monsters",
   labels: { singular: "monster", plural: "monsters" },
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
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "desc",
         type: "text",
      },
      {
         name: "fight_desc",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
