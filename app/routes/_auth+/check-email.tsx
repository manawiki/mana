import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/");
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
      <div className="mx-6 mt-20 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
         <div
            className="border-color bg-2 shadow-1 text-1 relative 
               rounded-xl border p-6 text-center font-semibold shadow-sm"
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
   );
}
