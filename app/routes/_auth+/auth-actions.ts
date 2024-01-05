import { type ActionFunction, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsDelete } from "~/utils/http.server";

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   switch (intent) {
      case "deleteUserAccount": {
         assertIsDelete(request);
         invariant(user);
         const result = await payload.delete({
            collection: "users",
            id: user.id,
            user,
            overrideAccess: false,
         });
         if (result) return redirect("/");
      }

      default:
         return null;
   }
};
