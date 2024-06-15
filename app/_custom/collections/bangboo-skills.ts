import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";
export const BangbooSkills: CollectionConfig = {
  slug: "bangboo-skills",
  labels: { singular: "bangboo-skill", plural: "bangboo-skills" },
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
      name: "desc",
      type: "textarea",
    },
    {
      name: "bangboo",
      type: "relationship",
      relationTo: "bangboos",
    },
    {
      name: "params",
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
      name: "icon_path",
      type: "text",
    },
    {
      name: "icon_name",
      type: "text",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "checksum",
      type: "text",
    },
  ],
};
