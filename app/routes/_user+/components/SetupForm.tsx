import { useState } from "react";

import {
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";

export function SetupForm() {
   const stripe = useStripe();
   const elements = useElements();

   const [errorMessage, setErrorMessage] = useState(null);
   const [isLoading, setLoading] = useState(false);

   const handleSubmit = async (event: any) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      if (!stripe || !elements) {
         // Stripe.js hasn't yet loaded.
         // Make sure to disable form submission until Stripe.js has loaded.
         return null;
      }
      setLoading(true);

      const { error } = await stripe.confirmSetup({
         elements,
         confirmParams: {
            return_url: `${
               process.env.NODE_ENV == "development"
                  ? "http://localhost:3000"
                  : "https://mana.wiki"
            }/user/confirm-payment-method`,
         },
      });
      setLoading(false);

      if (error) {
         setErrorMessage(error.message as any);
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit}>
            <PaymentElement
               options={{
                  layout: "accordion",
               }}
               className="pb-5 overflow-hidden"
            />
            {errorMessage && (
               <div className="text-sm text-red-500 pb-5">{errorMessage}</div>
            )}

            <div className="flex items-center justify-end">
               <Button
                  type="submit"
                  disabled={!stripe || isLoading}
                  className="text-sm cursor-pointer w-44 h-8"
               >
                  {isLoading ? <DotLoader /> : "Add Payment Method"}
               </Button>
            </div>
         </form>
      </>
   );
}
