import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { stripe } from "~/utils/stripe.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   invariant(user, "User must be logged in to confirm payment method.");
   const { setup_intent } = zx.parseQuery(request, {
      setup_intent: z.string(),
   });

   const setupIntent = await stripe.setupIntents.retrieve(setup_intent);

   switch (setupIntent.status) {
      case "succeeded":
         const stripeUser = await payload.findByID({
            collection: "users",
            id: user.id,
            user,
            overrideAccess: false,
         });
         if (stripeUser.stripeCustomerId) {
            const customerPaymentMethods =
               await stripe.customers.listPaymentMethods(
                  stripeUser.stripeCustomerId,
               );

            await stripe.customers.update(stripeUser.stripeCustomerId, {
               invoice_settings: {
                  default_payment_method: customerPaymentMethods.data[0]?.id,
               },
            });
            return redirectWithSuccess(
               "/",
               "Success! Your payment method has been saved.",
            );
         }

      case "processing":
         return redirectWithSuccess(
            "/",
            "Processing payment details. We'll update you when processing is complete.",
         );

      case "requires_payment_method":
         // Redirect your user back to your payment page to attempt collecting
         // payment again
         return redirectWithError(
            "/",
            "Failed to process payment details. Please try another payment method.",
         );
   }

   return null;
}

export default function ConfirmPayment() {
   return <div>Confirm payment method</div>;
}
