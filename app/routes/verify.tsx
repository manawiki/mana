import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zx } from "zodix";

export async function loader({
   context: { payload, user },
   request,
}: LoaderArgs) {
   if (user) {
      return redirect("/home");
   }
   const { token } = zx.parseQuery(request, {
      token: z.string(),
   });
   const result = await payload.verifyEmail({
      collection: "users",
      token,
   });
   if (result) {
      return "/login";
   }
}

//TODO Fix server side translation
export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Verify Email - Mana",
      },
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
         <div className="flex h-screen w-full items-center justify-center">
            <div className="border-color border bg-white p-6 shadow-sm dark:bg-zinc-800 laptop:rounded-lg">
               {t("register.verified")}
               <Link
                  className="flex h-10 items-center justify-center rounded 
                        bg-zinc-200 text-center text-xs font-bold dark:bg-zinc-700"
                  to="/login"
               >
                  {t("login.action")}
               </Link>
            </div>
         </div>
      </>
   );
}
