import { useFetcher, useLoaderData } from "@remix-run/react";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import type { loader as billingLoaderType } from "~/routes/_user+/user+/billing";
import { isAdding } from "~/utils/form";

export function PaymentMethods({
   setIsPaymentSetupFormOpen,
}: {
   setIsPaymentSetupFormOpen: (value: boolean) => void;
}) {
   const fetcher = useFetcher({ key: "billing" });
   const adding = isAdding(fetcher, "setupUserPayments");
   const data = useLoaderData<typeof billingLoaderType>();
   console.log(data);
   return (
      <>
         {data?.customerPaymentMethods ? (
            <>
               <div className="text-sm text-1 font-semibold pb-2 pt-2 pl-0.5">
                  Payment Methods
               </div>
               <div className="pb-4">
                  {data.customerPaymentMethods?.map((row) => {
                     return (
                        <div
                           className="flex items-center shadow-sm dark:shadow-zinc-800 justify-between gap-3 
                        border dark:border-zinc-700 rounded-lg bg-3-sub px-3 py-2 bg-zinc-50"
                           key={row.type}
                        >
                           <div className="flex items-center gap-3">
                              {row.type === "card" && (
                                 <Icon
                                    name="credit-card"
                                    size={18}
                                    className=""
                                 />
                              )}
                              <span className="text-1">{row.card?.brand}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                 <span className="w-1 h-1 rounded-full block bg-zinc-300 dark:bg-zinc-500" />
                                 <span className="w-1 h-1 rounded-full block bg-zinc-300 dark:bg-zinc-500" />
                                 <span className="w-1 h-1 rounded-full block bg-zinc-300 dark:bg-zinc-500" />
                                 <span className="w-1 h-1 rounded-full block bg-zinc-300 dark:bg-zinc-500" />
                              </div>
                              <span>{row.card?.last4}</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </>
         ) : (
            <>
               <div
                  className="p-3 rounded-xl border border-color-sub bg-2-sub shadow-sm 
                  dark:shadow-zinc-800/50 mb-6 flex items-center justify-between"
               >
                  <div className="text-sm font-semibold">
                     No payment methods...
                  </div>
                  <Button
                     className="text-sm cursor-pointer"
                     onClick={() => {
                        fetcher.submit(
                           { intent: "setupUserPayments" },
                           {
                              method: "post",
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
