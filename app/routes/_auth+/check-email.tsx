import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "~/components/Logo";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/hq");
   }
   return null;
}

//TODO Fix server side translation
export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Check Email - Mana",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   i18n: "auth",
};

export default function CheckEmail() {
   const { t } = useTranslation(handle?.i18n);
   return (
      <main>
         <div className="absolute left-0 top-12 z-10 flex w-full items-center justify-center">
            <Link to="/hq" className="flex items-center gap-2.5">
               <Logo className="h-7 w-7" />
            </Link>
         </div>
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
                  <Mail className="mx-auto" size={24} />
               </div>
               {t("register.checkEmail")}
            </div>
         </div>
      </main>
   );
}
