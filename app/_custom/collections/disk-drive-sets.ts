import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const DiskDriveSets: CollectionConfig = {
   slug: "disk-drive-sets",
   labels: { singular: "disk-drive-set", plural: "disk-drive-sets" },
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
         name: "desc",
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity_possible",
         type: "relationship",
         relationTo: "rarities",
         hasMany: true,
      },
      {
         name: "set_effect",
         type: "array",
         fields: [
            {
               name: "num",
               type: "number",
            },
            {
               name: "desc",
               type: "textarea",
            },
         ],
      },
      {
         name: "partitions",
         type: "array",
         fields: [
            {
               name: "name",
               type: "text",
            },
            {
               name: "desc",
               type: "textarea"
            },
            {
               name: "partition",
               type: "relationship",
               relationTo: "disk-drive-partitions",
            },
            {
               name: "main_stat_pool",
               type: "relationship",
               relationTo: "disk-drive-pools",
               hasMany: true,
            },
            {
               name: "sub_stat_pool",
               type: "relationship",
               relationTo: "disk-drive-pools",
               hasMany: true,
            }
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
