import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const _DeckLayouts: CollectionConfig = {
   slug: "_deck-layouts",
   labels: {
      singular: "_Deck-Layout",
      plural: "_Deck-Layouts",
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
         name: "description",
         type: "textarea",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
