import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { Icon } from "~/components/Icon";

export async function loader({
   context: { user },
   request,
}: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
   return null;
}

//TODO Fix server side translation
export const meta: MetaFunction = () => {
   return [
      {
         title: "Check Email - Mana",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export default function CheckEmail() {
   return (
      <div
         className="border-color bg-2 shadow-1 text-1 relative 
               rounded-xl border p-6 text-center font-semibold shadow-sm"
      >
         <div
            className="bg-3 border-color shadow-1 mx-auto mb-3 flex h-14
                     w-14 items-center justify-center rounded-full border shadow-sm"
         >
            <Icon name="mail" className="mx-auto" size={24} />
         </div>
         Check your email to verify your account
      </div>
   );
}
