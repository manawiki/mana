import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zx } from "zodix";
import { LogoFull } from "~/components/LogoFull";
import { commitSession, getSession, setSuccessMessage } from "~/utils";

export async function loader({
   context: { payload, user },
   request,
}: LoaderArgs) {
   if (user) {
      return redirect("/hq");
   }
   const { token, email } = zx.parseQuery(request, {
      token: z.string(),
      email: z.string().email().optional(),
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
      return redirect(`/login?email=${email}`, {
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
            <Link to="/hq" className="absolute left-5 top-5 p-1">
               <LogoFull />
            </Link>
            <div
               className="pattern-dots absolute left-0
                   top-0 h-full
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 pattern-size-4 dark:pattern-bg-black dark:pattern-zinc-600"
            ></div>
            <div
               className="absolute left-0 top-0 
            h-full w-full bg-gradient-to-b 
            from-zinc-200/50 via-transparent to-zinc-50/80 dark:from-zinc-800/50 dark:to-zinc-900/80"
            ></div>
            <div className="mt-32 laptop:mx-auto laptop:max-w-[380px]">
               <div
                  className="border-color bg-2 shadow-1 text-1 relative 
               border p-6 text-center text-lg font-semibold shadow-sm tablet:rounded-xl"
               >
                  <div
                     className="bg-3 border-color shadow-1 mx-auto mb-3 flex h-14
                     w-14 items-center justify-center rounded-full border shadow-sm"
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
