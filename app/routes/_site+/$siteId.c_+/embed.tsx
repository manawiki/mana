import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";

import type { Config } from "payload/generated-types";
import {
   assertIsPost,
   commitSession,
   getSession,
   setSuccessMessage,
} from "~/utils";

export async function action({
   context: { payload, user },
   request,
   params,
}: ActionFunctionArgs) {
   const { intent, pageId, collectionSlug, siteId, collectionId, entryId } =
      await zx.parseForm(request, {
         intent: z.enum(["unpublish", "publish"]),
         pageId: z.string(),
         collectionSlug: z.custom<keyof Config["collections"]>(),
         siteId: z.string(),
         collectionId: z.string(),
         entryId: z.string(),
      });

   if (!user) throw redirect("/login", { status: 302 });

   const session = await getSession(request.headers.get("cookie"));

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
         setSuccessMessage(session, "Successfully unpublished");
         return redirect(`/${siteId}/c/${collectionId}/${entryId}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
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
         setSuccessMessage(session, "Successfully published");
         return redirect(`/${siteId}/c/${collectionId}/${entryId}`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
   }
}
