import { useEffect } from "react";

import { useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import { Icon } from "~/components/Icon";
import { Text } from "~/components/Text";
import type { loader as userLoaderType } from "~/routes/_auth+/auth-actions";

export function PaymentMethods() {
   const fetcher = useFetcher();

   const data = fetcher.data as SerializeFrom<typeof userLoaderType>;

   useEffect(() => {
      if (fetcher.state === "idle" && fetcher.data == null) {
         fetcher.load("/auth-actions");
      }
   }, [fetcher]);
   return (
      <>
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
      </>
   );
}
