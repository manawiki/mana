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
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_id",
         type: "text",
      },
      {
         name: "obtain_way",
         type: "relationship",
         relationTo: "_item-obtain-ways",
      },
      {
         name: "no_obtain_way_hint",
         type: "textarea",
      },
      {
         name: "type",
         type: "relationship",
         relationTo: "_item-types",
      },
      {
         name: "showing_type",
         type: "relationship",
         relationTo: "_item-showing-types",
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_rarities",
      },
      {
         name: "sort_id1",
         type: "number",
      },
      {
         name: "sort_id2",
         type: "number",
      },
      {
         name: "max_backpack_stack_count",
         type: "number",
      },
      {
         name: "max_stack_count",
         type: "number",
      },
      {
         name: "backpack_can_discard",
         type: "checkbox",
      },
      {
         name: "price",
         type: "number",
      },
      {
         name: "model_key",
         type: "text",
      },
      {
         name: "valuable_tab_type",
         type: "relationship",
         relationTo: "_item-valuable-tab-types",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
