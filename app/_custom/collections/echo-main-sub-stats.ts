import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

// Note that this information is manually annotated as of 5/15/2024; may change in the future.

export const EchoMainSubStats: CollectionConfig = {
  slug: "echo-main-sub-stats",
  labels: { singular: "echo-main-sub-stat", plural: "echo-main-sub-stats" },
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
      name: "stats",
      type: "relationship",
      relationTo: "attributes",
      hasMany: true,
    },
    {
      name: "checksum",
      type: "text",
      required: true,
    },
  ],
};
