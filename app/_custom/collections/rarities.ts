import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Rarities: CollectionConfig = {
   slug: "rarities",
   labels: { singular: "rarity", plural: "rarities" },
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
         name: "num",
         type: "number",
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
