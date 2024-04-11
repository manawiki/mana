import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const MysticCodes: CollectionConfig = {
  slug: "mystic-codes",
  labels: { singular: "Mystic-Code", plural: "Mystic-Codes" },
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
      name: "path",
      type: "text",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "image_male",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "unlock_requirements",
      type: "relationship",
      relationTo: "quests",
      hasMany: false,
    },
    {
      name: "skills",
      type: "relationship",
      relationTo: "mystic-code-skills",
      hasMany: true,
    },
    {
      name: "level_exp",
      type: "number",
      hasMany: true,
    },
    {
      name: "overview",
      type: "textarea",
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
