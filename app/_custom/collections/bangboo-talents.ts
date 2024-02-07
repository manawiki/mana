import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";
export const BangbooTalents: CollectionConfig = {
  slug: "bangboo-talents",
  labels: { singular: "bangboo-talent", plural: "bangboo-talents" },
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
      name: "slot",
      type: "number",
    },
    {
      name: "bangboo",
      type: "relationship",
      relationTo: "bangboos",
    },
    {
      name: "levels",
      type: "array",
      fields: [
        {
          name: "data_key",
          type: "text",
        },
        {
          name: "rank",
          type: "number",
        },
        {
          name: "desc",
          type: "textarea",
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
