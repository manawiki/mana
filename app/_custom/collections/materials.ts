import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";
export const Materials: CollectionConfig = {
   slug: "materials",
   labels: { singular: "material", plural: "materials" },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
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
         name: "desc_flavor",
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "class",
         type: "relationship",
         relationTo: "_material-classes",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
