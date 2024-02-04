import { useState } from "react";

import { type MetaFunction, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type {
   ActionFunction,
   LoaderFunctionArgs,
} from "@remix-run/server-runtime";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useTheme } from "~/utils/client-hints";
import { stripe } from "~/utils/stripe.server";
import { useRootLoaderData } from "~/utils/useSiteLoaderData";

import { PaymentMethods } from "../components/PaymentMethods";
import { SetupForm } from "../components/SetupForm";
import { UserContainer } from "../components/UserContainer";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   invariant(user);

   //Fetch existing payment methods
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

export default function UserBilling() {
   const { stripePublicKey } = useRootLoaderData();

   const fetcher = useFetcher({ key: "billing" });

   const stripePromise = loadStripe(stripePublicKey);

   //@ts-ignore
   const clientSecret = fetcher.data?.clientSecret;

   const theme = useTheme();

   const colorBackground = theme === "dark" ? "#333537" : "#fafafa";
   const colorText = theme === "dark" ? "#CBD5E0" : "#555555";
   const colorPrimary = theme === "dark" ? "#e4e4e7" : "#555555";

   const appearance = {
      variables: {
         fontFamily: ' "NunitoSans", sans-serif',
         borderRadius: "10px",
         colorPrimary,
         colorBackground,
         colorText,
      },
      layout: "accordion",
   };
   const [isPaymentSetupFormOpen, setIsPaymentSetupFormOpen] = useState(false);

   return (
      <UserContainer title="Billing">
         {clientSecret && isPaymentSetupFormOpen ? (
            <>
               <Button
                  outline
                  className="text-xs mb-3 !py-2 !pr-4 cursor-pointer shadow-sm shadow-1 bg-zinc-50 dark:bg-dark400"
                  onClick={() =>
                     setIsPaymentSetupFormOpen(!isPaymentSetupFormOpen)
                  }
               >
                  <Icon
                     title="Back"
                     className="text-1"
                     name="arrow-left"
                     size={16}
                  />
                  Back
               </Button>
               <Elements
                  stripe={stripePromise}
                  options={{
                     clientSecret: clientSecret,
                     appearance,
                     fonts: [
                        {
                           family: "NunitoSans",
                           src: "url(/fonts/Nunito_Sans/nunitosans-regular-webfont.woff2)",
                           weight: "400",
                        },
                     ],
                  }}
               >
                  <SetupForm />
               </Elements>
            </>
         ) : (
            <>
               <PaymentMethods
                  setIsPaymentSetupFormOpen={setIsPaymentSetupFormOpen}
               />
            </>
         )}
      </UserContainer>
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: `Billing | User Settings - Mana`,
      },
   ];
};

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
