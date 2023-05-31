import { isStaffFieldLevel } from "../../access/user";
import type { User } from "payload/generated-types";
import type { CollectionConfig } from "payload/types";
import { canMutateAsSiteAdmin } from "../../access/site";

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
         required: true,
         defaultValue: ({ user }: { user: User }) => user.id,
         access: {
            update: isStaffFieldLevel,
         },
         maxDepth: 0,
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         required: true,
         maxDepth: 1,
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
