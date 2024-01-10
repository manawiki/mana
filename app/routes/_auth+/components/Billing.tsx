import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { loader as rootLoaderType } from "~/root";
import { useTheme } from "~/utils/client-hints";
import { isAdding } from "~/utils/form";

import { PaymentMethods } from "./PaymentMethods";
import { SetupForm } from "./SetupForm";

export function Billing() {
   const { stripePublicKey } = useRouteLoaderData("root") as SerializeFrom<
      typeof rootLoaderType
   >;

   const stripePromise = loadStripe(stripePublicKey);

   const fetcher = useFetcher();

   //@ts-ignore
   const clientSecret = fetcher.data?.clientSecret;

   const adding = isAdding(fetcher, "setupUserPayments");
   const theme = useTheme();

   return (
      <>
         <div className="pb-4 font-bold">Payment Methods</div>
         {clientSecret && (
            <div className="p-[1px]">
               <Elements
                  stripe={stripePromise}
                  options={{
                     clientSecret: clientSecret,
                     appearance: {
                        theme: theme == "dark" ? "night" : "stripe",
                     },
                  }}
               >
                  <SetupForm />
               </Elements>
            </div>
         )}
         <PaymentMethods />
         <div className="flex items-center justify-end">
            <Button
               className="text-sm cursor-pointer"
               onClick={() =>
                  fetcher.submit(
                     { intent: "setupUserPayments" },
                     {
                        method: "post",
                        action: "/auth-actions",
                     },
                  )
               }
            >
               {adding ? (
                  <Icon name="loader-2" size={16} className="animate-spin" />
               ) : (
                  <>Add payment method</>
               )}
            </Button>
         </div>
      </>
   );
}
