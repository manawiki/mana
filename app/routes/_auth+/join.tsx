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
import { type FormResponse, isAdding, isProcessing } from "~/utils/form";
import { assertIsPost } from "~/utils/http.server";

import { getSiteSlug } from "../_site+/_utils/getSiteSlug.server";

export async function loader({
   context: { user, payload },
   request,
}: LoaderFunctionArgs) {
   if (user) {
      return redirect("/");
   }
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

   return json({ site });
}

const JoinFormSchema = z.object({
   email: z
      .string()
      .email("Invalid email")
      .transform((email) => email.toLowerCase()),
   password: z.string().min(8, "Password must be at least 8 characters long"),
   username: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9]+(-[a-z0-9]+)*$/),
         "Username contains invalid characters",
      )
      .min(3, "Username must be at least 3 characters long")
      .max(24, "Username cannot be more than 24 characters long")
      .toLowerCase(),
});

export const meta: MetaFunction<typeof loader> = ({ data }) => {
   return [
      {
         title: `Join - ${data?.site?.name ?? "Mana"}`,
      },
   ];
};

export default function Signup() {
   const [searchParams] = useSearchParams();
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
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
               Create an account
            </div>
            <Form ref={zo.ref} method="post" replace>
               <Fieldset className="pb-8">
                  <FieldGroup>
                     <Field>
                        <Label>Username</Label>
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
                        <Label>Email address</Label>
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
                        <Label>Password</Label>
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
                  className="w-full h-10 mb-6 cursor-pointer"
                  disabled={disabled}
               >
                  {adding ? <DotLoader /> : "Create Account"}
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
                        Already have an account?
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
         //We follow the site the user is on
         const { siteSlug } = await getSiteSlug(request, payload, user);

         const site = await payload.find({
            collection: "sites",
            where: {
               slug: {
                  equals: siteSlug,
               },
            },
         });

         const siteId = site?.docs[0]?.id;

         await payload.create({
            collection: "users",
            data: {
               username,
               email,
               password,
               ...(siteId && { sites: [siteId] as any }),
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
