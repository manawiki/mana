import { z } from "zod";

export const ApplicationReviewSchema = z.object({
   siteId: z.string(),
   reviewMessage: z.string().optional(),
   applicantUserId: z.string(),
});
