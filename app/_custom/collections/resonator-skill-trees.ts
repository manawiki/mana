import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const ResonatorSkillTrees: CollectionConfig = {
   slug: "resonator-skill-trees",
   labels: {
      singular: "resonator-skill-tree",
      plural: "resonator-skill-trees",
   },
   admin: {
      group: "Custom",
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: () => true,
      update: isStaff,
      delete: isStaff,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         // TODO(dim): I don't like it like this...
         name: "node_type",
         type: "radio",
         options: [
            { label: "Skill", value: "SKILL_NODE" },
            { label: "Passive", value: "PASSIVE_NODE" },
            { label: "Bonus", value: "BONUS_NODE" },
         ],
      },
      {
         name: "prev_node",
         type: "relationship",
         relationTo: "resonator-skill-trees",
      },
      {
         name: "next_node",
         type: "relationship",
         relationTo: "resonator-skill-trees",
      },
      // Field present only on SKILL_NODE and PASSIVE_NODE node_type.
      {
         name: "resonator_skill",
         type: "relationship",
         relationTo: "resonator-skills",
      },
      // Fields present only on BONUS_NODE node_type.
      {
         name: "bonus_name",
         type: "text",
      },
      {
         name: "bonus_desc",
         type: "text",
      },
      {
         name: "bonus_icon",
         type: "relationship",
         relationTo: "images",
      },
      // Field present only on PASSIVE_NODE and BONUS_NODE node_type.
      {
         name: "unlock_costs",
         type: "array",
         fields: [
            {
               name: "item",
               type: "relationship",
               relationTo: "items",
            },
            {
               name: "cnt",
               type: "number",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
         required: true,
      },
   ],
};
