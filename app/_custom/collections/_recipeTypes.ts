import { isStaff } from "../../access/user";
import type { CollectionConfig } from "payload/types";

export const _RecipeTypes: CollectionConfig = {
   slug: "_recipeTypes",
   labels: { singular: "_recipeType", plural: "_recipeTypes" },
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
         name: "description",
         type: "text",
      },
      {
         name: "order",
         type: "number",
      },
      {
         name: "unlock_id",
         type: "text",
      },
      {
         name: "is_main_type",
         type: "checkbox",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
