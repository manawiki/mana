import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const WeaponCurves: CollectionConfig = {
   slug: "weaponCurves",
   labels: { singular: "weaponCurve", plural: "weaponCurves" },
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
