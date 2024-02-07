import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";
export const DiskDrives: CollectionConfig = {
  slug: "disk-drives",
  labels: { singular: "disk-drive", plural: "disk-drives" },
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
      name: "rarity",
      type: "relationship",
      relationTo: "_rarities",
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
