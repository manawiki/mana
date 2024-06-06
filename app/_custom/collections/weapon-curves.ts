import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const WeaponCurves: CollectionConfig = {
   slug: "weapon-curves",
   labels: { singular: "weapon-curve", plural: "weapon-curves" },
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
         name: "values",
         type: "array",
         fields: [
            {
               name: "level",
               type: "number",
            },
            {
               name: "ascension_level",
               type: "number",
            },
            {
               name: "value",
               type: "number",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
