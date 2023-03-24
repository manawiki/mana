import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const _Rarity: CollectionConfig = {
   slug: "_rarity-lKJ16E5IhH",
   labels: { singular: "_rarity", plural: "_rarities" },
   admin: { 
         group: "Custom",
         useAsTitle:  "display_number",
   },
   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "entry",
         type: "relationship",
         relationTo: "entries",
         hasMany: false,
         required: true,
		 filterOptions: () => {
			 return {
				 collectionEntity: { equals: "_rarity-lKJ16E5IhH" },
			 };
		 },
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "data_key",
         type: "text",
      },
      {
         name: "display_number",
         type: "text",
      },
      {
         name: "color",
         type: "text",
      },
      {
         name: "color_line",
         type: "text",
      },
      {
         name: "image_frame_name",
         type: "text",
      },
      {
         name: "icon_frame_name",
         type: "text",
      },
      {
         name: "image_bg_name",
         type: "text",
      },
      {
         name: "image_frame",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "icon_frame",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image_bg",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
