import { useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import type { loader as userLoaderType } from "~/routes/_auth+/auth-actions";
import { isAdding, isLoading } from "~/utils/form";

export function PaymentMethods({
   setIsPaymentSetupFormOpen,
}: {
   setIsPaymentSetupFormOpen: (value: boolean) => void;
}) {
   const fetcher = useFetcher({ key: "billing" });

   const data = fetcher.data as SerializeFrom<typeof userLoaderType>;

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data == null) {
         fetcher.load("/auth-actions");
      }
   }, [fetcher]);

   const loading = isLoading(fetcher);
   const adding = isAdding(fetcher, "setupUserPayments");

   return (
      <>
         {data?.customerPaymentMethods ? (
            <div className="pb-4">
               {data?.customerPaymentMethods?.map((row) => {
                  return (
                     <div
                        className="flex items-center shadow-sm dark:shadow-zinc-800 justify-between gap-3 
                        border dark:border-zinc-700 rounded-lg bg-3-sub px-3 py-2 bg-zinc-50"
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
         ) : loading ? (
            <div className="space-y-2 pb-3">
               <div className="animate-pulse bg-zinc-100 dark:bg-dark400 h-6 w-full rounded" />
               <div className="animate-pulse bg-zinc-100 dark:bg-dark400 h-6 w-full rounded" />
            </div>
         ) : (
            <>
               <Text>No payment methods</Text>
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
