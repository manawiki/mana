import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Skills: CollectionConfig = {
  slug: "skills",
  labels: { singular: "skill", plural: "skills" },
  admin: {
    group: "Custom",
    useAsTitle: "name",
  },
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
      name: "data_key",
      type: "text",
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "character",
      type: "relationship",
      relationTo: "agents",
    },
    {
      name: "text_type",
      type: "text",
    },
    {
      name: "skill_type",
      type: "text",
    },
    {
      name: "description",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "desc",
          type: "textarea",
        },
      ],
    },
    {
      name: "stats",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "params",
          type: "json",
        },
      ],
    },
    {
      name: "checksum",
      type: "text",
    },
  ],
};
