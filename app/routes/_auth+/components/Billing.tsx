import { useEffect } from "react";

import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import type { loader as rootLoaderType } from "~/root";
import type { loader as userLoaderType } from "~/routes/_auth+/auth-actions";
import { useTheme } from "~/utils/client-hints";
import { isAdding } from "~/utils/form";

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

   const data = fetcher.data as SerializeFrom<typeof userLoaderType>;

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data == null) {
         fetcher.load("/auth-actions");
      }
   }, [fetcher]);

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
                  <SetupForm clientSecret={clientSecret} />
               </Elements>
            </div>
         )}
         {data?.customerPaymentMethods ? (
            <div className="pb-5">
               {data?.customerPaymentMethods?.map((row) => {
                  return (
                     <div
                        className="flex items-center shadow-sm dark:shadow-zinc-800 justify-between gap-3 
                        border dark:border-zinc-700 rounded-lg bg-3-sub px-3 py-2"
                        key={row.type}
                     >
                        <div className="flex items-center gap-3">
                           {row.type === "card" && (
                              <Icon name="credit-card" size={18} className="" />
                           )}
                           <span className="text-1">{row.card?.brand}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full block dark:bg-zinc-500" />
                              <span className="w-1 h-1 rounded-full block dark:bg-zinc-500" />
                              <span className="w-1 h-1 rounded-full block dark:bg-zinc-500" />
                              <span className="w-1 h-1 rounded-full block dark:bg-zinc-500" />
                           </div>
                           <span>{row.card?.last4}</span>
                        </div>
                     </div>
                  );
               })}
            </div>
         ) : (
            <Text>No payment methods</Text>
         )}
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
