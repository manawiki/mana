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
         <div
            className="pattern-dots pattern-zinc-400 dark:pattern-zinc-600
                   pattern-bg-white dark:pattern-bg-black
                     pattern-size-4 pattern-opacity-10 absolute top-0 left-0 w-full h-full"
         ></div>
         <div
            className="bg-gradient-to-b from-white/70 to-zinc-50/80 
            dark:from-zinc-800/50 via-transparent dark:to-zinc-900/80 
            absolute top-0 left-0 w-full h-full"
         ></div>
         <Link
            to="/"
            className="absolute top-5 left-5 flex h-9 w-9 items-center gap-2.5"
         >
            <Logo className="h-7 w-7" />
            <span className="font-logo text-3xl pb-1">mana</span>
         </Link>
         <div className="absolute top-5 right-5 flex items-center gap-5">
            <DarkModeToggle />
         </div>
         <div className="mt-20 laptop:mx-auto laptop:mt-40 laptop:max-w-[440px]">
            <div
               className="border-color border-y bg-2 p-6 
               laptop:rounded-xl shadow-sm shadow-1 laptop:border relative"
            >
               <div className="border-color mb-4 border-b-2 pb-4 text-center text-xl font-bold">
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
                  <div className="flex items-center !mt-4">
                     <div className="text-center text-sm">
                        {t("register.alreadyHaveAnAccount")}{" "}
                        <Link
                           className="text-blue-500 font-bold"
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
