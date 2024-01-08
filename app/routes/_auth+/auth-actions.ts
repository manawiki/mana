import { type ActionFunction, redirect, json } from "@remix-run/node";
import type Stripe from "stripe";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsDelete } from "~/utils/http.server";
import { stripe } from "~/utils/stripe.server";

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
      case "setupUserPayments": {
         try {
            const params: Stripe.Checkout.SessionCreateParams = {
               payment_method_types: ["card"],
               mode: "setup",
               ui_mode: "embedded",
               return_url:
                  "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
            };

            const session: Stripe.Checkout.Session =
               await stripe.checkout.sessions.create(params);
            console.log(session);
            return json({ clientSecret: session.client_secret });
         } catch (error: any) {
            console.error(error.message);
         }
      }

      default:
         return null;
   }
};
