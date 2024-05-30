import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Echoes: CollectionConfig = {
   slug: "echoes",
   labels: { singular: "echo", plural: "echoes" },
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
         name: "code",
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
         name: "rarity",
         type: "relationship",
         relationTo: "rarities",
      },
      {
         name: "element",
         type: "relationship",
         relationTo: "elements",
      },
      {
         name: "class",
         type: "relationship",
         relationTo: "echo-classes",
      },
      {
         name: "skill",
         type: "relationship",
         relationTo: "echo-skills",
      },
      {
         name: "sonata_effect_pool",
         type: "relationship",
         relationTo: "sonata-effects",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
