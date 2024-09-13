import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import { redirectWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { Icon } from "~/components/Icon";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
   const { token, email } = zx.parseQuery(request, {
      token: z.string(),
      email: z.string().email().optional(),
   });
   const result = await payload.verifyEmail({
      collection: "users",
      token,
   });

   if (result) {
      return redirectWithSuccess(
         email ? `/login?email=${encodeURIComponent(email)}` : "/login",
         "Your email has been verified. You can now login.",
      );
   }
}

//TODO Fix server side translation
export const meta: MetaFunction = () => {
   return [
      {
         title: "Verify Email",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

export default function CheckEmail() {
   const { t } = useTranslation(handle?.i18n);
   return (
      <>
         <div
            className="border-color bg-2 shadow-1 text-1 relative 
               border p-6 text-center text-lg font-semibold shadow-sm tablet:rounded-xl"
         >
            <div
               className="bg-3 border-color shadow-1 mx-auto mb-3 flex h-14
                     w-14 items-center justify-center rounded-full border shadow-sm"
            >
               <Icon name="check" className="mx-auto" size={24} />
            </div>
            {t("register.verified")}
         </div>
      </>
   );
}
