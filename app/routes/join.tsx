import type {
   ActionFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { Form, Link, useNavigation, useSearchParams } from "@remix-run/react";
import { i18nextServer } from "~/utils/i18n";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import {
   type FormResponse,
   assertIsPost,
   isAdding,
   isProcessing,
} from "~/utils";
import { useTranslation } from "react-i18next";
import { Github, Loader2 } from "lucide-react";
import { Logo } from "~/components/Logo";
import { parseFormSafe } from "zodix";
import { Err } from "~/components/Forms";
import { DarkModeToggle } from "~/components/DarkModeToggle";

export async function loader({ context: { user }, request }: LoaderArgs) {
   if (user) {
      return redirect("/");
   }
   const t = await i18nextServer.getFixedT(request, "auth");
   const title = t("register.title");
   return json({ title });
}

const JoinFormSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
   password: z.string().min(8, "Password must be at least 8 characters long"),
   username: z.string().min(3, "Username must be at least 3 characters long"),
});

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: `${data.title} - Mana`,
      },
   ];
};

export default function Signup() {
   const zo = useZorm("join", JoinFormSchema);
   const [searchParams] = useSearchParams();
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation("auth");
   const adding = isAdding(transition, "join");
   return (
      <main>
         <Link
            to="/"
            className="absolute top-5 left-5 flex h-9 w-9 items-center gap-1.5"
         >
            <div className="h-7 w-7 flex-none">
               <Logo className="h-8 w-8" />
            </div>
         </Link>
         <div className="absolute top-5 right-5 flex items-center gap-5">
            <a
               target="_blank"
               href="https://github.com/manawiki/core"
               rel="noreferrer"
            >
               <Github className="text-1" size={20} />
            </a>
            <span className="h-4 w-0.5 rounded-full bg-3" />
            <DarkModeToggle />
         </div>
         <div className="mt-20 laptop:mx-auto laptop:mt-40 laptop:max-w-[440px]">
            <div className="border-color-1 border-y bg-1 p-6 laptop:rounded-lg laptop:border">
               <div className="border-color-1 mb-4 border-b-2 pb-4 text-center text-xl font-bold">
                  {t("register.title")}
               </div>
               <Form ref={zo.ref} method="post" className="space-y-4" replace>
                  <div>
                     <label
                        className="label-default"
                        htmlFor={zo.fields.username()}
                     >
                        {t("register.username")}
                     </label>
                     <div className="mt-1">
                        <input
                           autoFocus={true}
                           type="text"
                           name={zo.fields.username()}
                           autoComplete="username"
                           className="input-text"
                           disabled={disabled}
                        />
                        {zo.errors.username((err) => (
                           <Err>{err.message}</Err>
                        ))}
                     </div>
                  </div>
                  <div>
                     <label
                        className="label-default"
                        htmlFor={zo.fields.email()}
                     >
                        {t("register.email")}
                     </label>
                     <div className="mt-1">
                        <input
                           name={zo.fields.email()}
                           type="email"
                           autoComplete="email"
                           className="input-text"
                           disabled={disabled}
                        />
                        {zo.errors.email((err) => (
                           <Err>{err.message}</Err>
                        ))}
                     </div>
                  </div>
                  <div>
                     <label
                        className="label-default"
                        htmlFor={zo.fields.password()}
                     >
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
                        {zo.errors.password((err) => (
                           <Err>{err.message}</Err>
                        ))}
                     </div>
                  </div>
                  <button
                     name="intent"
                     value="join"
                     type="submit"
                     className="!mt-6 mb-3 h-11 w-full rounded bg-zinc-500 px-4
                     font-bold text-white hover:bg-zinc-600 focus:bg-zinc-400"
                     disabled={disabled}
                  >
                     {adding ? (
                        <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-400" />
                     ) : (
                        t("register.action")
                     )}
                  </button>
                  <div className="flex items-center justify-center py-2">
                     <div className="text-center text-sm">
                        {t("register.alreadyHaveAnAccount")}{" "}
                        <Link
                           className="text-blue-500 underline"
                           to={{
                              pathname: "/login",
                              search: searchParams.toString(),
                           }}
                        >
                           {t("register.login")}
                        </Link>
                     </div>
                  </div>
               </Form>
            </div>
         </div>
      </main>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   assertIsPost(request);
   if (user) {
      return redirect("/home");
   }
   const issues = createCustomIssues(JoinFormSchema);
   const result = await parseFormSafe(request, JoinFormSchema);
   if (result.success) {
      const { email, password, username } = result.data;

      const { totalDocs } = await payload.find({
         collection: "users",
         where: {
            username: {
               equals: username,
            },
         },
         user,
      });
      if (totalDocs != 0) {
         issues.username(`Username ${username} already in use`);
      }
      if (issues.hasIssues()) {
         return json<FormResponse>(
            { serverIssues: issues.toArray() },
            { status: 400 }
         );
      }
      try {
         await payload.create({
            collection: "users",
            data: {
               username,
               email,
               password,
            },
            overrideAccess: false,
            user,
         });
         return redirect("/check-email");
      } catch (error) {
         return json({
            error: "Something went wrong...unable to create account.",
         });
      }
   }
   //If user input has problems
   if (issues.hasIssues()) {
      return json<FormResponse>(
         { serverIssues: issues.toArray() },
         { status: 400 }
      );
   }
   // Last resort error message
   return json({
      error: "Something went wrong...unable to add collection.",
   });
};
