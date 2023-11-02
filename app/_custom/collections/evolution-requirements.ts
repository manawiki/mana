import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const EvolutionRequirements: CollectionConfig = {
   slug: "evolution-requirements",
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
         name: "name",
         type: "text",
      },
   ],
};
