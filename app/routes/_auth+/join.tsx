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
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import {
   type FormResponse,
   assertIsPost,
   isAdding,
   isProcessing,
} from "~/utils";
import { useTranslation } from "react-i18next";
import { Logo } from "~/components/Logo";
import { parseFormSafe } from "zodix";
import { FormLabel } from "~/components/Forms";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { DotLoader } from "~/components/DotLoader";

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
   const [searchParams] = useSearchParams();
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation("auth");
   const adding = isAdding(transition, "join");

   const formResponse = useActionData<FormResponse>();
   const zo = useZorm("join", JoinFormSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   return (
      <>
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
                  className="border-color border-y bg-2 p-6 
                  tablet:rounded-xl shadow-sm shadow-1 tablet:border relative"
               >
                  <div className="border-color mb-6 border-b-2 pb-4 text-center text-xl font-bold">
                     {t("register.title")}
                  </div>
                  <Form
                     ref={zo.ref}
                     method="post"
                     className="space-y-4"
                     replace
                  >
                     <fieldset>
                        <FormLabel
                           htmlFor={zo.fields.username()}
                           text={t("register.username")}
                           error={zo.errors.username((err) => err.message)}
                        />
                        <div className="mt-1">
                           <input
                              autoFocus={true}
                              type="text"
                              name={zo.fields.username()}
                              autoComplete="username"
                              className="input-text"
                              disabled={disabled}
                           />
                        </div>
                     </fieldset>
                     <fieldset>
                        <FormLabel
                           htmlFor={zo.fields.email()}
                           text={t("register.email")}
                           error={zo.errors.email((err) => err.message)}
                        />
                        <div className="mt-1">
                           <input
                              name={zo.fields.email()}
                              type="email"
                              autoComplete="email"
                              className="input-text"
                              disabled={disabled}
                           />
                        </div>
                     </fieldset>
                     <fieldset>
                        <FormLabel
                           htmlFor={zo.fields.password()}
                           text={t("register.password")}
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
                     <button
                        name="intent"
                        value="join"
                        type="submit"
                        className="!mt-6 mb-3 h-11 w-full rounded bg-zinc-500 px-4
                        font-bold text-white hover:bg-zinc-600 focus:bg-zinc-400"
                        disabled={disabled}
                     >
                        {adding ? <DotLoader /> : t("register.action")}
                     </button>
                     <div className="flex items-center justify-center">
                        <div className="text-center text-1 text-sm">
                           <Link
                              className="text-blue-500 font-bold"
                              to={{
                                 pathname: "/login",
                                 search: searchParams.toString(),
                              }}
                           >
                              {t("register.alreadyHaveAnAccount")}
                           </Link>
                        </div>
                     </div>
                  </Form>
               </div>
            </div>
         </main>
      </>
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

      const { totalDocs: emailExists } = await payload.find({
         collection: "users",
         where: {
            email: {
               equals: email,
            },
         },
         user,
      });
      if (emailExists != 0) {
         issues.email(`Email already in use`);
      }
      const { totalDocs: usernameExists } = await payload.find({
         collection: "users",
         where: {
            username: {
               equals: username,
            },
         },
         user,
      });
      if (usernameExists != 0) {
         issues.username(`Username already in use`);
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
      error: "Something went wrong...unable to add user.",
   });
};
