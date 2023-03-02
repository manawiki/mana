import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zx } from "zodix";
import { Logo } from "~/components/Logo";
import { commitSession, getSession, setSuccessMessage } from "~/utils";

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
   const session = await getSession(request.headers.get("cookie"));

   if (result) {
      setSuccessMessage(
         session,
         "Your email has been verified. You can now login."
      );
      return redirect("/login", {
         headers: { "Set-Cookie": await commitSession(session) },
      });
   }
}

//TODO Fix server side translation
export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Verify Email - Mana",
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
         <main>
            <div className="flex items-center z-10 justify-center absolute top-12 left-0 w-full">
               <Link to="/" className="flex items-center gap-2.5">
                  <Logo className="h-7 w-7" />
                  <span className="font-logo text-3xl pb-1">mana</span>
               </Link>
            </div>
            <div
               className="pattern-dots pattern-zinc-400 dark:pattern-zinc-600
                   pattern-bg-white dark:pattern-bg-black
                     pattern-size-4 pattern-opacity-10 absolute top-0 left-0 w-full h-full"
            ></div>
            <div
               className="bg-gradient-to-b from-zinc-200/50 to-zinc-50/80 
            dark:from-zinc-800/50 via-transparent dark:to-zinc-900/80 
            absolute top-0 left-0 w-full h-full"
            ></div>
            <div className="laptop:mx-auto mt-32 laptop:max-w-[380px]">
               <div
                  className="border-color border bg-2 shadow-1 relative 
               p-6 shadow-sm tablet:rounded-xl text-1 text-lg font-semibold text-center"
               >
                  <div
                     className="w-14 h-14 rounded-full bg-3 mx-auto border border-color
                     mb-3 flex items-center justify-center shadow-sm shadow-1"
                  >
                     <Check className="mx-auto" size={24} />
                  </div>
                  {t("register.verified")}
               </div>
            </div>
         </main>
      </>
   );
}
