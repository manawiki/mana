import type {
   ActionFunction,
   LinksFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
   Form,
   Link,
   useActionData,
   useLoaderData,
   useNavigation,
   useSearchParams,
} from "@remix-run/react";
import { i18nextServer } from "~/utils/i18n";
import { useZorm } from "react-zorm";
import { z } from "zod";
import {
   type FormResponse,
   assertIsPost,
   isAdding,
   isProcessing,
   safeRedirect,
} from "~/utils";
import { useTranslation } from "react-i18next";
import {
   commitSession,
   getSession,
   setErrorMessage,
   setSuccessMessage,
} from "~/utils/message.server";
import { FormLabel } from "~/components/Forms";
import { DotLoader } from "~/components/DotLoader";
import { zx } from "zodix";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { settings } from "mana-config";

const LoginFormSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
   password: z.string().min(8, "Password must be at least 8 characters long"),
   redirectTo: z.string().optional(),
});

const PasswordResetSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
});

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("login.title");

   const { email } = zx.parseQuery(request, {
      email: z.string().email().optional(),
   });

   return json({ title, email });
}

export const links: LinksFunction = () => {
   return [{ rel: "canonical", href: `${settings.domainFull}/login` }];
};

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: `${data.title} - Mana`,
      },
   ];
};

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

export default function Login() {
   const [searchParams] = useSearchParams();
   const redirectTo = searchParams.get("redirectTo") ?? undefined;
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation("auth");
   const adding = isAdding(transition, "login");
   const addingPasswordRest = isAdding(transition, "reset-password");
   const { email } = useLoaderData<typeof loader>() || {};
   const formResponse = useActionData<FormResponse>();
   const zo = useZorm("login", LoginFormSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   const zoPW = useZorm("pw-reset", PasswordResetSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   const [isReset, setIsReset] = useState(false);
   return (
      <div
         className="border-color bg-2 shadow-1 relative border-y
               p-6 shadow-sm tablet:rounded-xl tablet:border"
      >
         {isReset ? (
            <div className="border-color mb-6 flex items-center justify-between border-b-2 pb-4">
               <div className="text-xl font-bold">Reset Password</div>
               <button
                  className="bg-3 shadow-1 flex items-center gap-2
                        rounded-full py-2 pl-3 pr-4 text-sm font-bold shadow-sm"
                  onClick={() => setIsReset(false)}
               >
                  <ArrowLeft className="text-blue-500" size={20} />
                  Back
               </button>
            </div>
         ) : (
            <div className="border-color mb-6 border-b-2 pb-4 text-center text-xl font-bold">
               {t("login.title")}
            </div>
         )}
         {isReset ? (
            <>
               <Form ref={zoPW.ref} method="post" className="space-y-6" replace>
                  <fieldset>
                     <FormLabel
                        htmlFor={zoPW.fields.email()}
                        text={t("login.email")}
                        error={zoPW.errors.email((err) => err.message)}
                     />
                     <div className="mt-1">
                        <input
                           autoFocus={true}
                           name={zoPW.fields.email()}
                           type="email"
                           className="input-text"
                           autoComplete="email"
                           disabled={disabled}
                        />
                     </div>
                  </fieldset>
                  <button
                     name="intent"
                     value="reset-password"
                     type="submit"
                     className="h-11 w-full rounded bg-zinc-500 px-4 font-bold text-white
                            hover:bg-zinc-600 focus:bg-zinc-400"
                     disabled={disabled}
                  >
                     {addingPasswordRest ? <DotLoader /> : t("pwReset.title")}
                  </button>
               </Form>
            </>
         ) : (
            <>
               <Form ref={zo.ref} method="post" className="space-y-6" replace>
                  <fieldset>
                     <FormLabel
                        htmlFor={zo.fields.email()}
                        text={t("login.email")}
                        error={zo.errors.email((err) => err.message)}
                     />
                     <div className="mt-1">
                        <input
                           autoFocus={email ? false : true}
                           name={zo.fields.email()}
                           type="email"
                           className="input-text"
                           autoComplete="email"
                           disabled={disabled}
                           defaultValue={email ?? ""}
                        />
                     </div>
                  </fieldset>
                  <fieldset>
                     <FormLabel
                        htmlFor={zo.fields.password()}
                        text={t("login.password")}
                        error={zo.errors.password((err) => err.message)}
                     />
                     <div className="mt-1">
                        <input
                           autoFocus={email ? true : false}
                           name={zo.fields.password()}
                           type="password"
                           autoComplete="new-password"
                           className="input-text"
                           disabled={disabled}
                        />
                     </div>
                     <button
                        type="button"
                        className="pt-1.5 text-sm font-semibold text-blue-500"
                        onClick={() => setIsReset(true)}
                     >
                        Forgot your password?
                     </button>
                  </fieldset>
                  <input
                     type="hidden"
                     name={zo.fields.redirectTo()}
                     value={redirectTo}
                  />
                  <button
                     name="intent"
                     value="login"
                     type="submit"
                     className="h-11 w-full rounded bg-zinc-500 px-4 font-bold text-white hover:bg-zinc-600 focus:bg-zinc-400"
                     disabled={disabled}
                  >
                     {adding ? <DotLoader /> : t("login.action")}
                  </button>
                  <div className="!mt-4 flex items-center justify-center">
                     <div className="text-center text-sm">
                        {t("login.dontHaveAccount")}
                        <Link
                           className="pl-1 font-bold text-blue-500"
                           to={{
                              pathname: "/join",
                              search: searchParams.toString(),
                           }}
                        >
                           {t("login.signUp")}
                        </Link>
                     </div>
                  </div>
               </Form>
            </>
         )}
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

   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   if (intent === "reset-password") {
      const { email } = await zx.parseForm(request, PasswordResetSchema);
      const token = await payload.forgotPassword({
         collection: "users",
         data: {
            email,
         },
         disableEmail: false,
      });
      if (token) {
         const session = await getSession(request.headers.get("cookie"));
         setSuccessMessage(
            session,
            "We sent you an email with a link to reset your password"
         );
         return redirect("/login", {
            headers: { "Set-Cookie": await commitSession(session) },
         });
      }
   }

   if (intent === "login") {
      const session = await getSession(request.headers.get("cookie"));
      const result = await zx.parseFormSafe(request, LoginFormSchema);

      if (result.success) {
         const { email, password, redirectTo } = result.data;
         const { email: signUpEmail } = zx.parseQuery(request, {
            email: z.string().email().optional(),
         });
         try {
            await payload.login({
               collection: "users",
               data: { email, password },
               res,
            });
         } catch (error) {
            setErrorMessage(
               session,
               "The email or password provided is incorrect"
            );
            return redirect(`/login${signUpEmail ? `?email=${email}` : ""}`, {
               headers: { "Set-Cookie": await commitSession(session) },
            });
         }
         return redirect(safeRedirect(redirectTo));
      }
   }
};
