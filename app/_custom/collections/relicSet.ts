import { isStaff } from "../../../db/access";
import type { CollectionConfig } from "payload/types";

export const RelicSet: CollectionConfig = {
   slug: "relicSet",
   labels: { singular: "relicSet", plural: "relicSets" },
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
         name: "relicset_id",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon_name",
         type: "text",
      },
      {
         name: "set_effect",
         type: "array",
         fields: [
            {
               name: "req_no",
               type: "number",
            },
            {
               name: "description",
               type: "text",
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
