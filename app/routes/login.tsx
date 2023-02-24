import type {
   ActionFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { i18nextServer } from "~/utils/i18n";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";
import { assertIsPost, isAdding, isProcessing, safeRedirect } from "~/utils";
import { useTranslation } from "react-i18next";
import { Github, Loader2 } from "lucide-react";
import {
   commitSession,
   getSession,
   setErrorMessage,
} from "~/utils/message.server";
import { Logo } from "~/components/Logo";
import { DarkModeToggle } from "~/components/DarkModeToggle";

const LoginFormSchema = z.object({
   email: z
      .string()
      .email("invalid-email")
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
   const zo = useZorm("login", LoginFormSchema);
   const [searchParams] = useSearchParams();
   const redirectTo = searchParams.get("redirectTo") ?? undefined;
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation("auth");
   const adding = isAdding(transition, "login");

   return (
      <main>
         <Link
            to="/"
            className="absolute top-5 left-5 flex h-9 w-9 items-center gap-1.5"
         >
            <div className="h-7 w-7 flex-none">
               <Logo options="width=70,height=70" />
            </div>
            <div className="font-logo text-2xl">mana</div>
         </Link>
         <div className="absolute top-5 right-5 flex items-center gap-5">
            <a
               target="_blank"
               href="https://github.com/manawiki/core"
               rel="noreferrer"
            >
               <Github className="text-1" size={20} />
            </a>
            <span className="h-4 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <DarkModeToggle />
         </div>
         <div className="mt-20 laptop:mx-auto laptop:mt-40 laptop:max-w-[440px]">
            <div className="border-color border-y bg-white p-6 shadow-sm dark:bg-zinc-800 laptop:rounded-lg laptop:border">
               <div className="border-color mb-4 border-b-2 pb-4 text-center text-xl font-bold">
                  {t("login.title")}
               </div>
               <Form ref={zo.ref} method="post" className="space-y-6" replace>
                  <div>
                     <label htmlFor={zo.fields.email()}>
                        {t("login.email")}
                     </label>

                     <div className="mt-1">
                        <input
                           required
                           autoFocus={true}
                           name={zo.fields.email()}
                           type="email"
                           className="input-text"
                           autoComplete="email"
                           disabled={disabled}
                        />
                        {zo.errors.email()?.message && (
                           <div className="pt-1 text-red-500">
                              {zo.errors.email()?.message}
                           </div>
                        )}
                     </div>
                  </div>
                  <div>
                     <label htmlFor={zo.fields.password()}>
                        {t("register.password")}
                     </label>
                     <div className="mt-1">
                        <input
                           name={zo.fields.password()}
                           type="password"
                           autoComplete="new-password"
                           className="input-text"
                           disabled={disabled}
                        />
                        {zo.errors.password()?.message && (
                           <div className="pt-1 text-red-500">
                              {zo.errors.password()?.message}
                           </div>
                        )}
                     </div>
                  </div>
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
                     {adding ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-400" />
                     ) : (
                        t("login.action")
                     )}
                  </button>
                  <div className="flex items-center justify-center">
                     <div className="text-center text-sm">
                        {t("login.dontHaveAccount")}
                        <Link
                           className="pl-0.5 text-blue-500 underline"
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
