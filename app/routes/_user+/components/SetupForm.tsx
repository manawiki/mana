import { useState } from "react";

import {
   PaymentElement,
   useElements,
   useStripe,
} from "@stripe/react-stripe-js";

import { Button } from "~/components/Button";

export function SetupForm() {
   const stripe = useStripe();
   const elements = useElements();

   const [errorMessage, setErrorMessage] = useState(null);

   const handleSubmit = async (event: any) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      if (!stripe || !elements) {
         // Stripe.js hasn't yet loaded.
         // Make sure to disable form submission until Stripe.js has loaded.
         return null;
      }

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

      if (error) {
         setErrorMessage(error.message as any);
      } else {
         // Your customer will be redirected to your `return_url`. For some payment
         // methods like iDEAL, your customer will be redirected to an intermediate
         // site first to authorize the payment, then redirected to the `return_url`.
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
               <div className="text-sm text-red-500">{errorMessage}</div>
            )}

            <div className="flex items-center justify-end">
               <Button type="submit" disabled={!stripe} className="text-sm">
                  Add Payment Method
               </Button>
            </div>
         </form>
      </>
   );
}
