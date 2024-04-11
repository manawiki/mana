import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const MysticCodeSkills: CollectionConfig = {
  slug: "mystic-code-skills",
  labels: { singular: "Mystic-Code-Skill", plural: "Mystic-Code-Skills" },
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
      name: "cooldown",
      type: "number",
    },
    {
      name: "effect",
      type: "textarea",
    },
    {
      name: "effect_values",
      type: "textarea",
    },
    {
      name: "availability",
      type: "relationship",
      relationTo: "_availabilities",
      hasMany: false,
    },
    {
      name: "skill_image",
      type: "relationship",
      relationTo: "_skill-images",
      hasMany: false,
    },
    {
      name: "target",
      type: "relationship",
      relationTo: "_targets",
      hasMany: false,
    },
    {
      name: "type_specific",
      type: "relationship",
      relationTo: "_skill-classification-specifics",
      hasMany: false,
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
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
