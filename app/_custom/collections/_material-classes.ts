import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../access/user";

export const _MaterialClasses: CollectionConfig = {
  slug: "_material-classes",
  labels: { singular: "_material-class", plural: "_material-classes" },
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
      name: "checksum",
      type: "text",
    },
  ],
};
