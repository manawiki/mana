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
   useNavigation,
   useSearchParams,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import { parseFormSafe } from "zodix";

import { Button } from "~/components/Button";
import { DotLoader } from "~/components/DotLoader";
import {
   ErrorMessage,
   Field,
   FieldGroup,
   Fieldset,
   Label,
} from "~/components/Fieldset";
import { Input } from "~/components/Input";
import type { loader as rootLoader } from "~/root";
import { type FormResponse, isAdding, isProcessing } from "~/utils/form";
import { assertIsPost } from "~/utils/http.server";
import { i18nextServer } from "~/utils/i18n/i18next.server";

export async function loader({
   context: { user },
   request,
}: LoaderFunctionArgs) {
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
         "Username contains invalid characters",
      )
      .min(3, "Username must be at least 3 characters long")
      .max(16, "Username cannot be more than 16 characters long")
      .toLowerCase(),
});

export const meta: MetaFunction<
   typeof loader,
   {
      root: typeof rootLoader;
   }
> = () => {
   return [
      {
         title: `Join - Mana`,
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
            className="border-color-sub bg-2-sub shadow-1 relative 
                  border-y p-6 shadow-sm tablet:rounded-xl tablet:border"
         >
            <div className="border-color-sub mb-6 border-b-2 pb-4 text-center text-xl font-bold">
               {t("register.title")}
            </div>
            <Form ref={zo.ref} method="post" replace>
               <Fieldset className="pb-8">
                  <FieldGroup>
                     <Field>
                        <Label>{t("register.username")}</Label>
                        <Input
                           type="text"
                           disabled={disabled}
                           className="lowercase"
                           name={zo.fields.username()}
                        />
                        {zo.errors.username((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                     <Field>
                        <Label>{t("register.email")}</Label>
                        <Input
                           type="email"
                           disabled={disabled}
                           name={zo.fields.email()}
                        />
                        {zo.errors.email((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                     <Field>
                        <Label>{t("register.password")}</Label>
                        <Input
                           type="password"
                           disabled={disabled}
                           name={zo.fields.password()}
                        />
                        {zo.errors.password((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                  </FieldGroup>
               </Fieldset>
               <Button
                  name="intent"
                  value="join"
                  type="submit"
                  color="dark/white"
                  className="w-full h-10 mb-6"
                  disabled={disabled}
               >
                  {adding ? <DotLoader /> : t("register.action")}
               </Button>
               <div className="flex items-center justify-center">
                  <div className="text-1 text-center text-sm">
                     <Link
                        className="text-blue-500 hover:underline"
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
            { status: 400 },
         );
      }
      try {
         await payload.create({
            collection: "users",
            data: {
               //@ts-ignore
               username,
               email,
               //@ts-ignore
               password,
               //@ts-ignore
               sites: ["TLPWIBnfCr"],
            },
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
         { status: 400 },
      );
   }
   // Last resort error message
   return json({
      error: "Something went wrong...unable to add user.",
   });
};
