import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _Cvs: CollectionConfig = {
   slug: "_cvs",
   labels: { singular: "_Cv", plural: "_Cvs" },
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
         name: "data_key",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "ce_With_CV",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
