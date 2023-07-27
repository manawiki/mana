import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";

export const _Rarities: CollectionConfig = {
   slug: "_rarities",
   labels: { singular: "_rarity", plural: "_rarities" },
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
         name: "hex",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
   ],
};
