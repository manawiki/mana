import { z } from "zod";

export const CollectionSchema = z.object({
   name: z
      .string()
      .min(1, "Collection name cannot less  than 1 characters")
      .max(40, "Collection name cannot be more than 40 characters"),
   slug: z
      .string()
      .min(1)
      .max(40)
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Collection slug contains invalid characters",
      ),
   siteId: z.string(),
   hiddenCollection: z.coerce.boolean(),
   customListTemplate: z.coerce.boolean(),
   customEntryTemplate: z.coerce.boolean(),
   customDatabase: z.coerce.boolean(),
});

export const CollectionUpdateSchema = z.object({
   name: z.string().min(1).max(40),
   collectionId: z.string(),
   siteId: z.string(),
   hiddenCollection: z.coerce.boolean(),
   customListTemplate: z.coerce.boolean(),
   customEntryTemplate: z.coerce.boolean(),
   customDatabase: z.coerce.boolean(),
});
