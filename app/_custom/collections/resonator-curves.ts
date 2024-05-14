import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ResonatorCurves: CollectionConfig = {
   slug: "resonator-curves",
   labels: { singular: "resonator-curve", plural: "resonator-curves" },
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
         name: "level",
         type: "number",
      },
      {
         name: "lb_lv",
         type: "number",
      },
      {
         name: "ratios",
         type: "array",
         fields: [
            {
               name: "stat",
               type: "relationship",
               relationTo: "attributes",
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
