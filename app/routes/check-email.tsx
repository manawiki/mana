import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useTranslation } from "react-i18next";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/home");
   }
   return null;
}

//TODO Fix server side translation
export const meta: V2_MetaFunction = () => {
   return [
      {
         title: "Check Email - Mana",
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
            <div className="border-color border bg-1 p-6 shadow-sm laptop:rounded-lg">
               {t("register.checkEmail")}
            </div>
         </div>
      </>
   );
}
