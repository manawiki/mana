import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";

export const Rarities: CollectionConfig = {
   slug: "rarity",
   labels: { singular: "rarity", plural: "rarities" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff
   },
   fields: [
      {
         name: "id",
         type: "text"
      },
      {
         name: "name",
         type: "text"
      },
      {
         name: "hex",
         type: "text"
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images"
      }
   ]
};
