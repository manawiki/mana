import { useEffect, useState } from "react";

import { json, redirect } from "@remix-run/node";
import type { SerializeFrom, ActionFunction } from "@remix-run/node";
import {
   Form,
   Link,
   useNavigation,
   useRouteLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Value, useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { DotLoader } from "~/components/DotLoader";
import {
   Description,
   ErrorMessage,
   Field,
   FieldGroup,
   Label,
} from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import type { loader as rootLoaderType } from "~/root";
import { isAdding, isProcessing } from "~/utils/form";
import { assertIsPost } from "~/utils/http.server";

import { LoggedIn } from "../../_auth+/components/LoggedIn";
import { LoggedOut } from "../../_auth+/components/LoggedOut";

const SiteSchema = z.object({
   siteName: z.string().min(3, "Name is too short."),
   siteSlug: z
      .string()
      .regex(
         new RegExp(/^[a-z0-9_]+((\.-?|-\.?)[a-z0-9_]+)*$/),
         "Slug contains invalid characters",
      )
      .min(3, "Slug must be at least 3 characters long")
      .max(16, "Slug cannot be more than 16 characters long")
      .toLowerCase(),
});

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "site",
};

export function NewSiteModal() {
   const [isOpen, setIsOpen] = useState(false);
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation(handle?.i18n);

   const adding = isAdding(transition, "addSite");
   const zo = useZorm("newSite", SiteSchema);

   const { user } = useRouteLoaderData("root") as {
      user: SerializeFrom<typeof rootLoaderType>["user"];
   };
   useEffect(() => {
      if (!adding) {
         //@ts-ignore
         zo.refObject.current && zo.refObject.current.reset();
         setIsOpen(false);
      }
   }, [adding, zo.refObject]);

   return (
      <>
         <div className="flex items-center justify-center">
            <button
               className="dark:bg-dark400 border-2 dark:border-zinc-700 shadow-1 bg-white
               text-1 flex h-12 w-12 items-center justify-center dark:hover:border-zinc-600 border-zinc-200
               rounded-full shadow-sm transition duration-300 active:translate-y-0.5 hover:border-zinc-300"
               type="button"
               aria-label="Create New Site"
               onClick={() => setIsOpen(true)}
            >
               <Icon name="plus" size={20} />
            </button>
         </div>
         <Dialog
            className="relative"
            size="md"
            onClose={setIsOpen}
            open={isOpen}
         >
            <LoggedOut>
               <div className="space-y-2 pb-8 pt-6">
                  <div className="text-center font-header text-xl font-bold">
                     Login to create a new wiki on Mana!
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <Link
                     to="/join"
                     className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-5 
                           py-2 font-medium text-indigo-600 transition duration-300 ease-out"
                  >
                     <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                     <span
                        className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 
                           rotate-45 transform rounded-full bg-teal-500 opacity-30 transition duration-500 group-hover:rotate-90"
                     ></span>
                     <span className="relative text-sm font-bold text-white">
                        {t("login.signUp", { ns: "auth" })}
                     </span>
                  </Link>
                  <Link
                     className="border-color bg-3 shadow-1 flex h-10 items-center
                           justify-center rounded-full border text-center text-sm
                           font-bold shadow-sm"
                     to="/login"
                  >
                     {t("login.action", { ns: "auth" })}
                  </Link>
               </div>
            </LoggedOut>
            <LoggedIn>
               <div className="pb-3 mb-3 font-header text-xl font-bold border-b-2 border-color">
                  Create a new site
               </div>
               <Form ref={zo.ref} method="post" action="/action/new-site-modal">
                  <FieldGroup>
                     <Field>
                        <Label>Name</Label>
                        <Input
                           type="text"
                           disabled={disabled}
                           className="lowercase"
                           name={zo.fields.siteName()}
                        />
                        {zo.errors.siteName((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                     </Field>
                     <Field>
                        <Label>Slug</Label>
                        <Input
                           type="text"
                           disabled={disabled}
                           className="lowercase"
                           name={zo.fields.siteSlug()}
                        />
                        {zo.errors.siteSlug((err) => (
                           <ErrorMessage>{err.message}</ErrorMessage>
                        ))}
                        <Description className="flex items-center gap-1">
                           <span>Your site will be available at</span>
                           <div className="underline underline-offset-1 dark:decoration-zinc-500">
                              <span className="dark:text-zinc-200">
                                 {user?.username}
                              </span>
                              -
                              <Value zorm={zo} name={zo.fields.siteSlug()}>
                                 {(value) => (
                                    <span className="dark:text-zinc-200">
                                       {value}
                                    </span>
                                 )}
                              </Value>
                              <span>.mana.wiki</span>
                           </div>
                        </Description>
                     </Field>
                  </FieldGroup>
                  <Button
                     name="intent"
                     value="addSite"
                     type="submit"
                     disabled={disabled}
                     className="mt-6 h-10 w-full"
                  >
                     {adding ? <DotLoader /> : t("new.action")}
                  </Button>
               </Form>
            </LoggedIn>
         </Dialog>
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   assertIsPost(request);
   if (!user) {
      return redirect("/login");
   }

   const { siteName, siteSlug } = await zx.parseForm(request, SiteSchema);
   try {
      const userId = user.id;
      const userName = user.username;
      const siteId = `${userName}-${siteSlug}`;

      await payload.create({
         collection: "sites",
         data: {
            name: siteName,
            //@ts-expect-error
            owner: userId,
            id: siteId,
            //@ts-expect-error
            slug: siteId,
            type: "core",
         },
         overrideAccess: false,
         user,
      });

      const userData = user
         ? await payload.findByID({
              collection: "users",
              id: userId,
              user,
           })
         : undefined;

      //We need to get the current sites of the user, then prepare the new sites array
      const userCurrentSites = userData?.sites || [];
      const sites = userCurrentSites.map((site) =>
         typeof site === "string" ? site : site?.id,
      );

      //Finally we update the user with the new site id
      //@ts-ignore
      await payload.update({
         collection: "users",
         id: userId,
         data: { sites: [...sites, siteId] },
         overrideAccess: false,
         user,
      });

      return redirect(
         process.env.NODE_ENV == "development"
            ? `http://localhost:3000`
            : `https://${siteId}.mana.wiki`,
      );
   } catch (error) {
      return json({
         error: "Something went wrong...unable to create new site.",
      });
   }
};
