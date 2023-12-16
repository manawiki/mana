import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const DiskDriveSets: CollectionConfig = {
  slug: "disk-drive-sets",
  labels: { singular: "disk-drive-set", plural: "disk-drive-sets" },
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
      name: "set_effect",
      type: "array",
      fields: [
        {
          name: "num",
          type: "number",
        },
        {
          name: "desc",
          type: "textarea",
        },
      ],
    },
    {
      name: "disks",
      type: "relationship",
      relationTo: "disk-drives",
      hasMany: true,
    },
    {
      name: "rarity_possible",
      type: "relationship",
      relationTo: "_rarities",
      hasMany: true,
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
      name: "slug",
      type: "text",
    },
    {
      name: "checksum",
      type: "text",
    },
  ],
};
