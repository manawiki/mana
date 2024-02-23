import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _MangaSeries: CollectionConfig = {
  slug: "_manga-series",
  labels: {
    singular: "_Manga-Series",
    plural: "_Manga-Series",
  },
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
      name: "drupal_tid",
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
