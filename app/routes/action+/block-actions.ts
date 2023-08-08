import { type ActionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsPost, getMultipleFormData, uploadImage } from "~/utils";

export async function action({
   context: { payload, user },
   request,
}: ActionArgs) {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (!user || !user.id) return redirect("/login", { status: 302 });

   switch (intent) {
      case "addBlockImage": {
         assertIsPost(request);
         const result = await getMultipleFormData({
            request,
            prefix: "blockImage",
            schema: z.any(),
         });
         if (result.success) {
            const { image } = result.data;
            try {
               return await uploadImage({
                  payload,
                  image: image,
                  user,
               });
            } catch (error) {
               return json({
                  error: "Something went wrong...unable to add image.",
               });
            }
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to add image.",
         });
      }

      default:
         return null;
   }
}
