import type { CollectionConfig } from "payload/types";
import { isStaff, isStaffOrHasSiteAccess } from "../access";

export const noteTypesSlug = "notetypes";
export const NoteTypes: CollectionConfig = {
   slug: noteTypesSlug,
   admin: {
      useAsTitle: "name",
   },
   access: {
      create: isStaff,
      read: (): boolean => true,
      update: isStaffOrHasSiteAccess("id"),
      delete: isStaff,
   },
   fields: [
      {
         name: "name",
         type: "text",
         required: true,
      },
      {
         name: "id",
         type: "text",
      },
      {
         name: "description",
         type: "text",
      },
   ],
};
