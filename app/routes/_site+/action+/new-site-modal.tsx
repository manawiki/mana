import { useEffect, useState } from "react";

import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { Form, Link, useNavigation } from "@remix-run/react";
import { useZorm } from "react-zorm";
import urlSlug from "url-slug";
import { z } from "zod";
import { zx } from "zodix";

import { Button } from "~/components/Button";
import { Dialog } from "~/components/Dialog";
import { DotLoader } from "~/components/DotLoader";
import { ErrorMessage, Field, FieldGroup, Label } from "~/components/Fieldset";
import { Icon } from "~/components/Icon";
import { Input } from "~/components/Input";
import { isAdding, isProcessing } from "~/utils/form";
import { siteNanoID } from "~/utils/nanoid";

import { LoggedIn } from "../../_auth+/components/LoggedIn";
import { LoggedOut } from "../../_auth+/components/LoggedOut";

const SiteSchema = z.object({
   siteName: z.string().min(3, "Name is too short."),
});

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "site",
};

export function NewSiteModal() {
   const [isOpen, setIsOpen] = useState(false);
   const transition = useNavigation();
   const disabled = isProcessing(transition.state);

   const adding = isAdding(transition, "addSite");
   const zo = useZorm("newSite", SiteSchema);

   useEffect(() => {
      if (!adding) {
         zo.refObject.current && zo.refObject.current.reset();
         setIsOpen(false);
      }
   }, [adding, zo.refObject]);

   return (
      <>
         <div className="flex items-center justify-center">
            <button
               className="dark:bg-dark400 border-2 dark:border-zinc-700 shadow-1 bg-white
               text-1 flex size-11 items-center justify-center dark:hover:border-zinc-600 border-zinc-200
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
                        Sign up
                     </span>
                  </Link>
                  <Link
                     className="border-color dark:bg-white bg-zinc-900 dark:text-zinc-800 shadow-1 flex h-10 items-center
                           justify-center rounded-full border text-center text-sm text-white
                           font-bold shadow-sm"
                     to="/login"
                  >
                     Log in
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
                  </FieldGroup>
                  <Button
                     name="intent"
                     value="addSite"
                     type="submit"
                     disabled={disabled}
                     className="mt-6 h-10 w-full cursor-pointer"
                  >
                     {adding ? <DotLoader /> : "Add"}
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
   if (!user) {
      return redirect("/login");
   }

   try {
      const { siteName } = await zx.parseForm(request, SiteSchema);

      const slug = urlSlug(siteName.substring(0, 20));

      const siteSlug = `${slug}-${siteNanoID(5)}`;

      const siteId = `${user.id}-${siteNanoID(12)}`;

      await payload.create({
         collection: "sites",
         data: {
            id: siteId,
            name: siteName,
            owner: user.id as any,
            slug: siteSlug,
            type: "core",
         },
         overrideAccess: false,
         user,
      });

      const userData = user
         ? await payload.findByID({
              collection: "users",
              id: user.id,
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
         id: user.id,
         data: { sites: [...sites, siteId] },
         overrideAccess: false,
         user,
      });

      return redirect(
         process.env.NODE_ENV == "development"
            ? `http://localhost:3000`
            : `https://${siteSlug}.mana.wiki`,
      );
   } catch (error) {
      return json({
         error: "Something went wrong...unable to create new site.",
      });
   }
};
