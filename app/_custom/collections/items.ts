import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Items: CollectionConfig = {
  slug: "items",
  labels: { singular: "item", plural: "items" },
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
      name: "rarity",
      type: "relationship",
      relationTo: "rarities",
    },
    {
      name: "bag_slot",
      type: "relationship",
      relationTo: "item-bag-slots",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "item-categories",
    },
    {
      name: "desc",
      type: "text",
    },
    {
      name: "slug",
      type: "text",
    },
    {
      name: "checksum",
      type: "text",
      required: true,
    },
  ],
};
