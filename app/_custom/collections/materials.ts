import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const Materials: CollectionConfig = {
  slug: "materials",
  labels: { singular: "material", plural: "materials" },
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
      name: "desc_flavor",
      type: "textarea",
    },
    {
      name: "rarity",
      type: "relationship",
      relationTo: "_rarities",
    },
    {
      name: "class",
      type: "relationship",
      relationTo: "_material-classes",
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
