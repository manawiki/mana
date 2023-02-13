import type { CollectionConfig } from "payload/types";
import { isAdmin, isAdminOrHasSiteAccess } from "../access";

export const noteTypesSlug = "notetypes";
export const NoteTypes: CollectionConfig = {
  slug: noteTypesSlug,
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: isAdmin,
    read: (): boolean => true,
    update: isAdminOrHasSiteAccess("id"),
    delete: isAdmin,
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
