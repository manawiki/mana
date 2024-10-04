import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Attacks: CollectionConfig = {
   slug: "attacks",
   labels: { singular: "attack", plural: "attacks" },
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
         name: "desc",
         type: "text",
      },
      {
         name: "isDamaging",
         type: "checkbox",
      },
      {
         name: "damage",
         type: "number",
      },
      {
         name: "cost",
         type: "array",
         fields: [
            {
               name: "type",
               type: "relationship",
               relationTo: "types",
            },
            {
               name: "amount",
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
