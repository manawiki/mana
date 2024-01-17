import { useState } from "react";

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

   const fetcher = useFetcher({ key: "billing" });

   const stripePromise = loadStripe(stripePublicKey);

   //@ts-ignore
   const clientSecret = fetcher.data?.clientSecret;

   const theme = useTheme();

   const colorBackground = theme === "dark" ? "#37393B" : "#fafafa";
   const colorText = theme === "dark" ? "#CBD5E0" : "#555555";

   const appearance = {
      variables: {
         fontFamily: ' "NunitoSans", sans-serif',
         borderRadius: "10px",
         colorPrimary: "#3b82f6",
         colorBackground,
         colorText,
      },
      layout: "accordion",
   };
   const adding = isAdding(fetcher, "setupUserPayments");
   const [isPaymentSetupFormOpen, setIsPaymentSetupFormOpen] = useState(false);

   return (
      <>
         {clientSecret && isPaymentSetupFormOpen ? (
            <>
               <Button
                  outline
                  className="text-xs mb-3 !py-2 cursor-pointer shadow-sm shadow-1"
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
               <PaymentMethods />
               <div className="flex items-center justify-end">
                  <Button
                     className="text-sm cursor-pointer"
                     onClick={() => {
                        fetcher.submit(
                           { intent: "setupUserPayments" },
                           {
                              method: "post",
                              action: "/auth-actions",
                           },
                        );
                        setIsPaymentSetupFormOpen(true);
                     }}
                  >
                     {adding ? (
                        <Icon
                           name="loader-2"
                           size={16}
                           className="animate-spin"
                        />
                     ) : (
                        <>Add payment method</>
                     )}
                  </Button>
               </div>
            </>
         )}
      </>
   );
}
