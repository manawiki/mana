import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const MangaPages: CollectionConfig = {
  slug: "manga-pages",
  labels: { singular: "Manga-Page", plural: "Manga-Pages" },
  admin: { group: "Custom", useAsTitle: "name" },
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
      name: "path",
      type: "text",
    },
    {
      name: "chapter_no",
      type: "number",
    },
    {
      name: "header",
      type: "textarea",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "manga_series",
      type: "relationship",
      relationTo: "_manga-series",
      hasMany: false,
    },
    {
      name: "next_chapter",
      type: "relationship",
      relationTo: "manga-pages",
      hasMany: false,
    },
    {
      name: "previous_chapter",
      type: "relationship",
      relationTo: "manga-pages",
      hasMany: false,
    },
    {
      name: "dialogue",
      type: "array",
      fields: [
        {
          name: "manga_character_image",
          type: "relationship",
          relationTo: "_manga-character-images",
          hasMany: false,
        },
        {
          name: "quote",
          type: "textarea",
        },
        {
          name: "source",
          type: "select",
          hasMany: false,
          options: [
            {
              label: "right",
              value: "right",
            },
            {
              label: "left",
              value: "left",
            },
          ],
        },
      ],
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
