import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import type { Config } from "payload/generated-types";
import { assertIsPost } from "~/utils/http.server";

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionFunctionArgs) {
   const { intent, pageId, collectionSlug } = await zx.parseForm(request, {
      intent: z.enum(["unpublish", "publish"]),
      pageId: z.string(),
      collectionSlug: z.custom<keyof Config["collections"]>(),
      collectionId: z.string(),
      entryId: z.string(),
   });

   if (!user)
      throw redirect("/login", {
         status: 302,
      });

   switch (intent) {
      case "unpublish": {
         assertIsPost(request);
         await payload.update({
            collection: collectionSlug,
            id: pageId,
            data: {
               _status: "draft",
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Successfully unpublished");
      }
      case "publish": {
         assertIsPost(request);
         await payload.update({
            collection: collectionSlug,
            id: pageId,
            data: {
               _status: "published",
            },
            overrideAccess: false,
            user,
         });
         return jsonWithSuccess(null, "Successfully published");
      }
   }
}
