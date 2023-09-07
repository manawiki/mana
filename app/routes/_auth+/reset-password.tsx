import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import { DotLoader } from "~/components/DotLoader";
import { FormLabel } from "~/components/Forms";
import { assertIsPost, isAdding, isProcessing } from "~/utils";
import { i18nextServer } from "~/utils/i18n";
import {
   commitSession,
   getSession,
   setErrorMessage,
   setSuccessMessage,
} from "~/utils/message.server";



const PasswordResetSchema = z.object({
   password: z.string().min(8, "Password must be at least 8 characters long"),
   token: z.string(),
});

export async function loader({ context: { user }, request }: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("pwReset.title");
   return json({ title });
}

export const meta: MetaFunction = ({ data }) => {
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
            <input type="hidden" name={zoPW.fields.token()} value={token} />
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
   );
}

export const action: ActionFunction = async ({
   context: { payload, user, res },
   request,
}) => {
   assertIsPost(request);
   if (user) {
      return redirect("/");
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
