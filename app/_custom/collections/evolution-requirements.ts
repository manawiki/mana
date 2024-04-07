import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

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
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
   ],
};
