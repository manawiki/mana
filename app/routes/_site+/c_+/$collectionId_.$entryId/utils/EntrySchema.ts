import { z } from "zod";

export const EntrySchemaUpdateSchema = z.object({
   name: z.string().min(1).max(200),
   entryId: z.string(),
   slug: z.string(),
   existingSlug: z.string().optional(),
   siteId: z.string().optional(),
   collectionId: z.string().optional(),
});
