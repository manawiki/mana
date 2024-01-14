import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsDelete } from "~/utils/http.server";
import { stripe } from "~/utils/stripe.server";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   invariant(user);
   const existingStripeUser = await payload.findByID({
      collection: "users",
      id: user.id,
      user,
      overrideAccess: false,
   });

   const customerId = existingStripeUser.stripeCustomerId
      ? existingStripeUser.stripeCustomerId
      : false;

   if (customerId) {
      const customerPaymentMethods =
         await stripe.customers.listPaymentMethods(customerId);
      if (customerPaymentMethods.data.length > 0) {
         return json({ customerPaymentMethods: customerPaymentMethods.data });
      }
   }
   return null;
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });
   invariant(user);

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
            const existingStripeUser = await payload.find({
               collection: "users",
               where: {
                  id: {
                     equals: user.id,
                  },
                  stripeCustomerId: {
                     exists: true,
                  },
               },
               user,
               overrideAccess: false,
            });

            let customerId = existingStripeUser.docs[0]?.stripeCustomerId as
               | string
               | undefined;

            if (!customerId) {
               const getUser = await payload.findByID({
                  collection: "users",
                  id: user.id,
                  depth: 0,
                  user,
                  overrideAccess: false,
               });

               const customer = await stripe.customers.create({
                  email: getUser.email,
                  metadata: {
                     userId: user.id,
                  },
               });
               invariant(customer, "Failed to create Stripe customer");

               customerId = customer.id;

               const updateUser = await payload.update({
                  collection: "users",
                  id: user.id,
                  data: {
                     //@ts-ignore
                     stripeCustomerId: customerId,
                  },
                  user,
                  overrideAccess: false,
               });
               invariant(
                  updateUser,
                  "Failed to update user with Stripe customer id",
               );
            }

            const setupIntent = await stripe.setupIntents.create({
               customer: customerId,
               automatic_payment_methods: {
                  enabled: true,
               },
            });

            return json({ clientSecret: setupIntent.client_secret });
         } catch (error: any) {
            console.error(error.message);
         }
      }

      default:
         return null;
   }
};
