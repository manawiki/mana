import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Locations: CollectionConfig = {
  slug: "locations",
  labels: { singular: "Location", plural: "Locations" },
  admin: { group: "Custom", useAsTitle: "name" },

  access: {
    create: isStaff, //udpate in future to allow site admins as well
    read: () => true,
    update: isStaff, //udpate in future to allow site admins as well
    delete: isStaff, //udpate in future to allow site admins as well
  },
  fields: [
    {
      name: "id",
      type: "text",
    },
    {
      name: "drupal_nid",
      type: "text",
    },
    {
      name: "data_key",
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
      name: "order",
      type: "number",
    },
    {
      name: "chapter",
      type: "relationship",
      relationTo: "_chapters",
      hasMany: false,
    },
    {
      name: "slug",
      type: "text",
    },
    {
      name: "checksum",
      type: "text",
    },
  ],
};
