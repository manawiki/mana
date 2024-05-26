import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import { canMutateAsSiteAdmin } from "../../access/canMutateAsSiteAdmin";
import { isStaffFieldLevel } from "../users/access";

export const Updates: CollectionConfig = {
   slug: "updates",
   access: {
      create: canMutateAsSiteAdmin("updates"),
      read: () => true,
      update: canMutateAsSiteAdmin("updates"),
      delete: canMutateAsSiteAdmin("updates"),
   },
   fields: [
      {
         name: "createdBy",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
      },
      {
         name: "dateId",
         type: "text",
      },
      {
         name: "entry",
         type: "array",
         label: "Entry",
         labels: {
            singular: "Entry",
            plural: "Entries",
         },
         fields: [
            {
               name: "content",
               type: "json",
            },
         ],
      },
   ],
};
