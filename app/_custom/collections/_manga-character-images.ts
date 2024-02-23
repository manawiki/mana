import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const _MangaCharacterImages: CollectionConfig = {
  slug: "_manga-character-images",
  labels: {
    singular: "_Manga-Character-Image",
    plural: "_Manga-Character-Images",
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
