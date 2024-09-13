import { useState } from "react";

import type {
   ActionFunction,
   LoaderFunctionArgs,
   MetaFunction,
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
import * as cookie from "cookie";
import { useTranslation } from "react-i18next";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess, redirectWithError } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import {
   ErrorMessage,
   Field,
   FieldGroup,
   Fieldset,
   Label,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { type FormResponse, isAdding, isProcessing } from "~/utils/form";
import { assertIsPost, safeRedirect } from "~/utils/http.server";
import { i18nextServer } from "~/utils/i18n/i18next.server";

import { getSiteSlug } from "../_site+/_utils/getSiteSlug.server";

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

export async function loader({
   context: { user, payload },
   request,
}: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("login.title");

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const sites = await payload.find({
      collection: "sites",
      where: {
         slug: {
            equals: siteSlug,
         },
      },
      user,
   });

   const site = sites?.docs[0];

   const { email } = zx.parseQuery(request, {
      email: z.string().email().optional(),
   });

   return json({ title, email, site });
}
export const meta: MetaFunction<typeof loader> = ({ data }) => {
   return [
      {
         title: `${data?.title} - ${data?.site?.name ?? "Mana"}`,
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
         className="border-color-sub bg-2-sub shadow-1 relative 
      border-y p-6 shadow-sm tablet:rounded-xl tablet:border"
      >
         {isReset ? (
            <div className="border-color mb-6 flex items-center border-b-2 pb-4">
               <button
                  className="flex items-center gap-2 rounded-full py-2 pr-4 text-sm font-bold"
                  onClick={() => setIsReset(false)}
               >
                  <Icon name="arrow-left" className="text-blue-500" size={20} />
               </button>
               <div className="text-xl font-bold">Reset Password</div>
            </div>
         ) : (
            <div className="border-color-sub mb-6 border-b-2 pb-4 text-center text-xl font-bold">
               {t("login.title")}
            </div>
         )}
         {isReset ? (
            <>
               <Form ref={zoPW.ref} method="post" className="space-y-6" replace>
                  <Fieldset>
                     <Field>
                        <Label>{t("login.email")}</Label>
                        <Input
                           autoFocus={true}
                           autoComplete="email"
                           type="email"
                           disabled={disabled}
                           name={zoPW.fields.email()}
                        />
                        {zoPW.errors.email((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                  </Fieldset>
                  <Button
                     color="dark/white"
                     name="intent"
                     value="reset-password"
                     type="submit"
                     className="text-sm"
                     disabled={disabled}
                  >
                     {addingPasswordRest ? <DotLoader /> : t("pwReset.title")}
                  </Button>
               </Form>
            </>
         ) : (
            <>
               <Form ref={zo.ref} method="post" className="space-y-6" replace>
                  <Fieldset>
                     <FieldGroup>
                        <Field>
                           <Label>{t("login.email")}</Label>
                           <Input
                              autoFocus={email ? false : true}
                              autoComplete="email"
                              type="email"
                              disabled={disabled}
                              defaultValue={email ?? ""}
                              name={zo.fields.email()}
                           />
                           {zo.errors.email((err) => (
                              <ErrorMessage>{err.message}</ErrorMessage>
                           ))}
                        </Field>
                        <Field>
                           <Label>{t("login.password")}</Label>
                           <Input
                              type="password"
                              autoComplete="current-password"
                              disabled={disabled}
                              name={zo.fields.password()}
                           />
                           {zo.errors.password((err) => (
                              <ErrorMessage>{err.message}</ErrorMessage>
                           ))}
                        </Field>
                     </FieldGroup>
                     <button
                        type="button"
                        className="text-sm text-blue-500 mt-3 hover:underline"
                        onClick={() => setIsReset(true)}
                     >
                        Forgot your password?
                     </button>
                  </Fieldset>
                  <input
                     type="hidden"
                     name={zo.fields.redirectTo()}
                     value={redirectTo}
                  />
                  <Button
                     name="intent"
                     value="login"
                     type="submit"
                     color="dark/white"
                     className="w-full h-10 cursor-pointer"
                     disabled={disabled}
                  >
                     {adding ? <DotLoader /> : t("login.action")}
                  </Button>
                  <div className="flex items-center justify-center">
                     <div className="text-center text-sm">
                        {t("login.dontHaveAccount")}
                        <Link
                           className="pl-1 text-blue-500 hover:underline"
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
      const result = await zx.parseFormSafe(request, PasswordResetSchema);

      if (result.success) {
         const { email } = result.data;
         try {
            const token = await payload.forgotPassword({
               collection: "users",
               data: {
                  email,
               },
               disableEmail: false,
            });
            if (token) {
               return jsonWithSuccess(
                  null,
                  "We sent you an email with a link to reset your password",
               );
            }
            return jsonWithError(
               null,
               "This email doesn't exist, do you want to create a new account?",
            );
         } catch (error) {
            return jsonWithError(
               null,
               "Oops! Something went wrong. Please try again later.",
            );
         }
      }
      return;
   }

   if (intent === "login") {
      const result = await zx.parseFormSafe(request, LoginFormSchema);
      if (result.success) {
         const { email, password, redirectTo } = result.data;
         const { email: signUpEmail } = zx.parseQuery(request, {
            email: z.string().email().optional(),
         });
         try {
            // So subdomains can share the cookie, we will use the rest api to set the cookie manually
            const json = await payload.login({
               collection: "users",
               data: { email, password },
            });

            const hostname = new URL(request.url).hostname;

            // set the cookie on domain level so all subdomains can access it
            let domain = hostname.split(".").slice(-2).join(".");

            // don't set cookie domain on fly.dev due to Public Suffix List supercookie issue
            if (domain === "fly.dev") domain = "";

            if (!json.token) throw new Error("No token found");

            return redirect(redirectTo || "/", {
               headers: {
                  "Set-Cookie": cookie.serialize("payload-token", json.token, {
                     httpOnly: true,
                     secure:
                        process.env.NODE_ENV === "production" &&
                        domain !== "localhost",
                     sameSite: "lax",
                     path: "/",
                     maxAge: 60 * 60 * 24 * 30, // 30 days
                     domain,
                  }),
               },
            });
         } catch (error) {
            return redirectWithError(
               `/login${
                  signUpEmail ? `?email=${encodeURIComponent(email)}` : ""
               }`,
               "The email or password provided is incorrect",
            );
         }
         return redirect(safeRedirect(redirectTo));
      }
   }
};
