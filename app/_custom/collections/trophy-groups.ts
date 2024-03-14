import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const TrophyGroups: CollectionConfig = {
  slug: "trophy-groups",
  labels: { singular: "trophy-group", plural: "trophy-groups" },
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
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "trophy-categories",
    },
    {
      name: "checksum",
      type: "text",
      required: true,
    },
  ],
};
