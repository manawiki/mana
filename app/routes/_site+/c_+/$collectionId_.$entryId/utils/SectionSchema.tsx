import { z } from "zod";

export const SectionSchema = z.object({
   collectionId: z.string(),
   name: z.string(),
   sectionSlug: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Section slug contains invalid characters",
      ),
   showTitle: z.coerce.boolean(),
   showAd: z.coerce.boolean(),
   type: z.enum(["editor", "customTemplate", "qna", "comments"]),
});
