import { useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import type { loader as userLoaderType } from "~/routes/_auth+/auth-actions";
import { useTheme } from "~/utils/client-hints";
import { isAdding } from "~/utils/form";

import { SetupForm } from "./SetupForm";

const stripePromise = loadStripe(
   "pk_test_51NIHqPHY2vBdJM8edEvVJJsZYBTB61TXs3R5oFPhD0kPNLXmCBCCGgOicF3S7EGVkp7YGTeKmVD2g5LsV7iC3pIj00UJr87Pmn",
);

export function Billing() {
   const fetcher = useFetcher();

   //@ts-ignore
   const clientSecret = fetcher.data?.clientSecret;

   const adding = isAdding(fetcher, "setupUserPayments");
   const theme = useTheme();

   const data = fetcher.data as SerializeFrom<typeof userLoaderType>;

   useEffect(() => {
      if (data == undefined && fetcher.state === "idle") {
         fetcher.load("/auth-actions");
      }
   }, [fetcher]);

   return (
      <>
         <div className="pb-4 font-bold">Payment Methods</div>
         <div className="pb-3">
            <div
               className="dark:bg-dark350 bg-zinc-50 flex items-center mb-4
                justify-between border border-color-sub px-4 py-3.5 rounded-xl"
            >
               <div className="flex-grow text-sm font-semibold">
                  Add a payment method to your account
               </div>
               <Button
                  color="blue"
                  className="text-sm w-14"
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
                     <>Add</>
                  )}
               </Button>
            </div>
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
                     <SetupForm clientSecret={clientSecret} />
                  </Elements>
               </div>
            )}
         </div>
         {data?.customerPaymentMethods && (
            <>
               <Text className="border-b-2 border-color pb-2 mb-2 font-semibold">
                  Existing Payment Methods
               </Text>
               {data?.customerPaymentMethods?.map((row) => {
                  return (
                     <div className="flex items-center gap-3" key={row.type}>
                        <span>{row.card?.brand}</span>
                        <span>{row.card?.last4}</span>
                     </div>
                  );
               })}
            </>
         )}
      </>
   );
}
