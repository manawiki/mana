import { isStaff } from "../../access/user";
import type { GlobalConfig } from "payload/types";

export const CoreMeta: GlobalConfig = {
   slug: "core-meta",
   access: {
      read: (): boolean => true, // Everyone can read Images
      update: isStaff,
   },
   fields: [
      {
        name: "featuredSites",
        type: "array",
        required: true,
        maxRows: 8,
        fields: [
          {
            name: "site",
            type: "relationship",
            relationTo: "sites",
            required: true,
          },
        ],
      },
    ],
};
