import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, useNavigation, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useZorm } from "react-zorm";
import { redirectWithError, redirectWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { DotLoader } from "~/components/DotLoader";
import { ErrorMessage, Field, Fieldset, Label } from "~/components/Fieldset";
import { Input } from "~/components/Input";
import { isAdding, isProcessing } from "~/utils/form";
import { assertIsPost } from "~/utils/http.server";
import { i18nextServer } from "~/utils/i18n/i18next.server";

const PasswordResetSchema = z.object({
   password: z.string().min(8, "Password must be at least 8 characters long"),
   token: z.string(),
});

export async function loader({
   context: { user },
   request,
}: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("pwReset.title");
   return json({ title });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
   return [
      {
         title: `${data?.title}`,
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
            <Fieldset>
               <Field>
                  <Label>{t("register.password")}</Label>
                  <Input
                     type="password"
                     disabled={disabled}
                     name={zoPW.fields.password()}
                  />
                  {zoPW.errors.password((err) => (
                     <ErrorMessage>{err.message}</ErrorMessage>
                  ))}
               </Field>
            </Fieldset>
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
      try {
         await payload.resetPassword({
            collection: "users",
            data: {
               password,
               token,
            },
            overrideAccess: true,
         });

         return redirectWithSuccess(
            "/login",
            "Your password has been reset. You can now login.",
         );
      } catch (error) {
         return redirectWithError(
            "/login",
            "Something went wrong. Please try again.",
         );
      }
   }
};
