import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { Logo } from "~/components/Logo";

export async function loader({
   context: { user, payload },
   request,
}: LoaderArgs) {
   //If subdomain, we want to make /siteId the root
   const host = new URL(request.url).hostname;
   const isSubdomain = host.split(".").length > 2;
   if (
      process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT != "local" &&
      isSubdomain
   ) {
      const subDomain = host.split(".")[0];
      const result = await payload.find({
         collection: "sites",
         where: {
            subdomain: {
               equals: subDomain,
            },
         },
      });
      const siteId = result.docs[0].id;
      return redirect(`/${siteId}`, 301);
   }
   if (user) {
      return redirect("/home");
   }
   return null;
}

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

export default function HomeRoot() {
   const { t } = useTranslation(handle?.i18n);
   return (
      <>
         <div className="absolute right-2 bottom-2">
            <DarkModeToggle />
         </div>
         <div className="flex h-screen w-full items-center justify-center">
            <section>
               <Link to="/" className="mb-3 block pb-2 text-center">
                  <Logo options="width=36,height=36" className="mx-auto" />
                  <div className="pb-1 font-logo text-4xl">mana</div>
               </Link>
               <div className="flex items-center gap-3">
                  <Link
                     className="flex h-11 items-center justify-center rounded bg-zinc-500 
                            px-5 text-center text-white"
                     to="/join"
                  >
                     {t("login.signUp")}
                  </Link>
                  <Link
                     className="flex h-11 items-center justify-center rounded bg-zinc-200 
                            px-5 text-center dark:bg-zinc-700"
                     to="/login?redirectTo=/home"
                  >
                     {t("login.action")}
                  </Link>
               </div>
            </section>
         </div>
      </>
   );
}
