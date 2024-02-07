import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/access";
export const Agents: CollectionConfig = {
  slug: "agents",
  labels: { singular: "agent", plural: "agents" },
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
      name: "name_code",
      type: "text",
    },
    {
      name: "rarity",
      type: "relationship",
      relationTo: "_rarities",
    },
    {
      name: "damage_type",
      type: "relationship",
      relationTo: "_damage-types",
      hasMany: true,
    },
    {
      name: "damage_element",
      type: "relationship",
      relationTo: "_damage-elements",
      hasMany: true,
    },
    {
      name: "character_camp",
      type: "relationship",
      relationTo: "_character-camps",
    },
    {
      name: "gender",
      type: "text",
    },
    {
      name: "weapon_type",
      type: "text",
    },
    {
      name: "hp",
      type: "number",
    },
    {
      name: "atk",
      type: "number",
    },
    {
      name: "def",
      type: "number",
    },
    {
      name: "impact",
      type: "number",
    },
    {
      name: "crit",
      type: "number",
    },
    {
      name: "crit_damage",
      type: "number",
    },
    {
      name: "attribute_mastery",
      type: "number",
    },
    {
      label: "skills",
      type: "collapsible",
      fields: [
        {
          name: "skill_basic",
          type: "relationship",
          relationTo: "skills",
        },
        {
          name: "skill_dodge",
          type: "relationship",
          relationTo: "skills",
        },
        {
          name: "skill_special",
          type: "relationship",
          relationTo: "skills",
        },
        {
          name: "skill_chain",
          type: "relationship",
          relationTo: "skills",
        },
        {
          name: "skill_core",
          type: "relationship",
          relationTo: "skills",
        },
      ],
    },
    {
      name: "talents",
      type: "relationship",
      relationTo: "talents",
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
      name: "icon_full_path",
      type: "text",
    },
    {
      name: "icon_full_name",
      type: "text",
    },
    {
      name: "icon_general_path",
      type: "text",
    },
    {
      name: "icon_general_name",
      type: "text",
    },
    {
      name: "icon_round_path",
      type: "text",
    },
    {
      name: "icon_round_name",
      type: "text",
    },
    {
      name: "icon",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "icon_full",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "icon_general",
      type: "upload",
      relationTo: "images",
    },
    {
      name: "icon_round",
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
