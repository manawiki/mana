import type {
   ActionFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
   Form,
   Link,
   useActionData,
   useNavigation,
   useSearchParams,
} from "@remix-run/react";
import { i18nextServer } from "~/utils/i18n";
import { parseFormAny, useZorm } from "react-zorm";
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
} from "~/utils/message.server";
import { Logo } from "~/components/Logo";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { FormLabel } from "~/components/Forms";
import { DotLoader } from "~/components/DotLoader";

const LoginFormSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
   password: z.string().min(8, "Password must be at least 8 characters long"),
   redirectTo: z.string().optional(),
});

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/home");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("login.title");
   return json({ title });
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: `${data.title} - Mana`,
      },
   ];
};

export const action: ActionFunction = async ({
   context: { payload, user, res },
   request,
}) => {
   assertIsPost(request);
   if (user) {
      return redirect("/home");
   }
   const session = await getSession(request.headers.get("cookie"));
   const formData = await request.formData();
   const result = await LoginFormSchema.safeParseAsync(parseFormAny(formData));

   if (!result.success) {
      return json({ errors: result.error.issues }, { status: 400 });
   }

   const { email, password, redirectTo } = result.data;

   try {
      await payload.login({
         collection: "users",
         data: { email, password },
         res,
      });
   } catch (error) {
      setErrorMessage(session, "The email or password provided is incorrect");
      return redirect("/login", {
         headers: { "Set-Cookie": await commitSession(session) },
      });
   }
   return redirect(safeRedirect(redirectTo));
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

   const formResponse = useActionData<FormResponse>();
   const zo = useZorm("login", LoginFormSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   return (
      <main>
         <div
            className="pattern-dots pattern-zinc-400 dark:pattern-zinc-600
                   pattern-bg-white dark:pattern-bg-black
                     pattern-size-4 pattern-opacity-10 absolute top-0 left-0 w-full h-full"
         ></div>
         <div
            className="bg-gradient-to-b from-zinc-200/50 to-zinc-50/80 
            dark:from-zinc-800/50 via-transparent dark:to-zinc-900/80 
            absolute top-0 left-0 w-full h-full"
         ></div>
         <Link
            to="/"
            className="absolute top-5 left-5 flex items-center gap-2.5"
         >
            <Logo className="h-7 w-7" />
            <span className="font-logo text-3xl pb-1">mana</span>
         </Link>
         <div className="absolute top-5 right-5 flex items-center gap-5">
            <DarkModeToggle />
         </div>
         <div className="mt-20 tablet:mx-auto tablet:mt-40 tablet:max-w-[440px]">
            <div
               className="border-color border-y bg-2 p-6 relative
               tablet:rounded-xl shadow-sm shadow-1 tablet:border"
            >
               <div className="border-color mb-6 border-b-2 pb-4 text-center text-xl font-bold">
                  {t("login.title")}
               </div>
               <Form ref={zo.ref} method="post" className="space-y-6" replace>
                  <fieldset>
                     <FormLabel
                        htmlFor={zo.fields.email()}
                        text={t("login.email")}
                        error={zo.errors.email((err) => err.message)}
                     />
                     <div className="mt-1">
                        <input
                           autoFocus={true}
                           name={zo.fields.email()}
                           type="email"
                           className="input-text"
                           autoComplete="email"
                           disabled={disabled}
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
                           name={zo.fields.password()}
                           type="password"
                           autoComplete="new-password"
                           className="input-text"
                           disabled={disabled}
                        />
                     </div>
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
                  <div className="flex items-center justify-center !mt-4">
                     <div className="text-center text-sm">
                        {t("login.dontHaveAccount")}
                        <Link
                           className="pl-1 text-blue-500 font-bold"
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
            </div>
         </div>
      </main>
   );
}
