import { z } from "zod";

export const postSchema = z.object({
   title: z
      .string()
      .min(3, "Title is too short.")
      .max(200, "Title is too long.")
      .optional(),
   subtitle: z
      .string()
      .min(3, "Subtitle is too short.")
      .max(1000, "Subtitle is too long.")
      .optional(),
   banner: z
      .any()
      .refine((file) => file?.size <= 5000000, `Max image size is 5MB.`)
      .refine(
         (file) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
               file?.type
            ),
         "Only .jpg, .jpeg, .png and .webp formats are supported."
      )
      .optional(),
});
