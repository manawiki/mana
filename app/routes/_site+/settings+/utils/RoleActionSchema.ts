import { z } from "zod";

export const RoleActionSchema = z.object({
   siteId: z.string(),
   userId: z.string(),
});
