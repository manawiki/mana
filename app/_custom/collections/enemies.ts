import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const Enemies: CollectionConfig = {
  slug: "enemies",
  labels: { singular: "Enemy", plural: "Enemies" },
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
      name: "name",
      type: "text",
    },
    {
      name: "desc_skills",
      type: "textarea",
    },
    {
      name: "desc_np",
      type: "textarea",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "type",
      type: "relationship",
      relationTo: "_enemy-types",
      hasMany: false,
    },
    {
      name: "class_rarity",
      type: "relationship",
      relationTo: "_class-rarities",
      hasMany: false,
    },
    {
      name: "traits",
      type: "relationship",
      relationTo: "_enemy-traits",
      hasMany: true,
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
