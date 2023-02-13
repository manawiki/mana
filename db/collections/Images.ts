import type { CollectionConfig } from "payload/types";

export const imagesSlug = "images";
export const Images: CollectionConfig = {
  slug: imagesSlug,
  access: {
    read: (): boolean => true, // Everyone can read Images
  },
  fields: [],
};
