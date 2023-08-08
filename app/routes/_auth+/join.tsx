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
   useNavigation,
   useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import { parseFormSafe } from "zodix";

import { settings } from "mana-config";
import { DotLoader } from "~/components/DotLoader";
import { FormLabel } from "~/components/Forms";
import {
   type FormResponse,
   assertIsPost,
   isAdding,
   isProcessing,
} from "~/utils";
import { i18nextServer } from "~/utils/i18n";

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
   password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .toLowerCase(),
   username: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Username contains invalid characters"
      )
      .min(3, "Username must be at least 3 characters long")
      .max(16, "Username cannot be more than 16 characters long")
      .toLowerCase(),
});

export const links: LinksFunction = () => {
   return [{ rel: "canonical", href: `${settings.domainFull}/join` }];
};

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
         <div
            className="border-color bg-2 shadow-1 relative 
                  border-y p-6 shadow-sm tablet:rounded-xl tablet:border"
         >
            <div className="border-color mb-6 border-b-2 pb-4 text-center text-xl font-bold">
               {t("register.title")}
            </div>
            <Form ref={zo.ref} method="post" className="space-y-4" replace>
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
                        className="input-text lowercase"
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
                  <div className="text-1 text-center text-sm">
                     <Link
                        className="font-bold text-blue-500"
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
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   assertIsPost(request);
   if (user) {
      return redirect("/");
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
               sites: ["TLPWIBnfCr"],
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
