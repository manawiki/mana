import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";

export const SummonEvents: CollectionConfig = {
  slug: "summon-events",
  labels: { singular: "Summon-Event", plural: "Summon-Events" },
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
      name: "data_key",
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
      name: "featured_servants",
      type: "relationship",
      relationTo: "servants",
      hasMany: true,
    },
    {
      name: "featured_essences",
      type: "relationship",
      relationTo: "craft-essences",
      hasMany: true,
    },
    {
      name: "sim_number",
      type: "number",
    },
    {
      name: "summon_info",
      type: "textarea",
    },
    {
      name: "featured_ess_daily",
      type: "checkbox",
    },
    {
      name: "featured_only",
      type: "checkbox",
    },
    {
      name: "is_4star_guaranteed",
      type: "checkbox",
    },
    {
      name: "is_guaranteed",
      type: "checkbox",
    },
    {
      name: "available_in_jp",
      type: "checkbox",
    },
    {
      name: "available_in_na",
      type: "checkbox",
    },
    {
      name: "na_start_date",
      type: "text",
    },
    {
      name: "na_end_date",
      type: "text",
    },
    {
      name: "jp_start_date",
      type: "text",
    },
    {
      name: "jp_end_date",
      type: "text",
    },
    {
      name: "base_servant_override_3",
      type: "relationship",
      relationTo: "servants",
      hasMany: true,
    },
    {
      name: "base_servant_override_4",
      type: "relationship",
      relationTo: "servants",
      hasMany: true,
    },
    {
      name: "base_servant_override_5",
      type: "relationship",
      relationTo: "servants",
      hasMany: true,
    },
    {
      name: "base_ce_override_3",
      type: "relationship",
      relationTo: "craft-essences",
      hasMany: true,
    },
    {
      name: "base_ce_override_4",
      type: "relationship",
      relationTo: "craft-essences",
      hasMany: true,
    },
    {
      name: "base_ce_override_5",
      type: "relationship",
      relationTo: "craft-essences",
      hasMany: true,
    },
    {
      name: "servant_profile_future_banner",
      type: "array",
      fields: [
        {
          name: "banner_servant",
          type: "relationship",
          relationTo: "servants",
          hasMany: false,
        },
        {
          name: "banner_reference",
          type: "select",
          hasMany: false,
          options: [
            { value: "single", label: "Single" },
            { value: "shared", label: "Shared" },
            { value: "guaranteed-gacha", label: "Guaranteed Gacha" },
            { value: "class-based", label: "Class-Based" },
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
