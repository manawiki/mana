import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const ServantRedirects: CollectionConfig = {
  slug: "servant-redirects",
  labels: { singular: "Servant-Redirect", plural: "Servant-Redirects" },
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
      name: "drupal_nid",
      type: "text",
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "servant",
      type: "relationship",
      relationTo: "servants",
      hasMany: false,
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
