import type {
   ActionFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { assertIsPost, isAdding, isProcessing } from "~/utils";
import { useTranslation } from "react-i18next";
import {
   commitSession,
   getSession,
   setErrorMessage,
   setSuccessMessage,
} from "~/utils/message.server";
import { Logo } from "~/components/Logo";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { FormLabel } from "~/components/Forms";
import { DotLoader } from "~/components/DotLoader";
import { zx } from "zodix";
import { i18nextServer } from "~/utils/i18n";

const PasswordResetSchema = z.object({
   password: z.string().min(8, "Password must be at least 8 characters long"),
   token: z.string(),
});

export async function loader({
   context: { payload, user },
   request,
}: LoaderArgs) {
   if (user) {
      return redirect("/hq");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("pwReset.title");
   return json({ title });
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: `${data.title} - Mana`,
      },
   ];
};

export const handle = {
   i18n: "auth",
};

export default function ResetPassword() {
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation("auth");
   const adding = isAdding(transition, "password-reset");
   const [searchParams] = useSearchParams();
   const token = searchParams.get("token") ?? undefined;
   const zoPW = useZorm("pw-reset", PasswordResetSchema);

   return (
      <main>
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
         <Link
            to="/hq"
            className="absolute left-5 top-5 flex items-center gap-2.5"
         >
            <Logo className="h-7 w-7" />
            <span className="pb-1 font-logo text-3xl">mana</span>
         </Link>
         <div className="absolute right-5 top-5 flex items-center gap-5">
            <DarkModeToggle />
         </div>
         <div className="mt-20 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
            <div
               className="border-color bg-2 shadow-1 relative border-y
                p-6 shadow-sm tablet:rounded-xl tablet:border"
            >
               <div className="border-color mb-6 border-b-2 pb-4 text-center text-xl font-bold">
                  {t("pwReset.title")}
               </div>
               <Form ref={zoPW.ref} method="post" className="space-y-6" replace>
                  <fieldset>
                     <FormLabel
                        htmlFor={zoPW.fields.password()}
                        text={t("pwReset.password")}
                        error={zoPW.errors.password((err) => err.message)}
                     />
                     <div className="mt-1">
                        <input
                           name={zoPW.fields.password()}
                           type="password"
                           autoComplete="new-password"
                           className="input-text"
                           disabled={disabled}
                        />
                     </div>
                  </fieldset>
                  <input
                     type="hidden"
                     name={zoPW.fields.token()}
                     value={token}
                  />
                  <button
                     name="intent"
                     value="password-reset"
                     type="submit"
                     className="h-11 w-full rounded bg-zinc-500 px-4 font-bold text-white hover:bg-zinc-600 focus:bg-zinc-400"
                     disabled={disabled}
                  >
                     {adding ? <DotLoader /> : "Reset Password"}
                  </button>
               </Form>
            </div>
         </div>
      </main>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user, res },
   request,
}) => {
   assertIsPost(request);
   if (user) {
      return redirect("/hq");
   }

   const result = await zx.parseFormSafe(request, PasswordResetSchema);

   if (result.success) {
      const { password, token } = result.data;
      const session = await getSession(request.headers.get("cookie"));
      try {
         await payload.resetPassword({
            collection: "users",
            data: {
               password,
               token,
            },
            overrideAccess: true,
         });
         setSuccessMessage(
            session,
            "Your password has been reset. You can now login."
         );
         return redirect(`/login`, {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      } catch (error) {
         setErrorMessage(session, "Something went wrong. Please try again.");
         return redirect("/login", {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
   }
};
