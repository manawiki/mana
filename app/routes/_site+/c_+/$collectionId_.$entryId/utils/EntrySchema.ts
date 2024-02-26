import { z } from "zod";

export const EntrySchemaUpdateSchema = z.object({
   name: z.string().min(1).max(40),
   entryId: z.string(),
});
