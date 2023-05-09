import { useEffect, useState } from "react";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import { json, redirect, type ActionFunction } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
   assertIsPost,
   isAdding,
   isProcessing,
   getMultipleFormData,
   uploadImage,
   safeNanoID,
   type FormResponse,
} from "~/utils";
import { useTranslation } from "react-i18next";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { LoggedIn, LoggedOut } from "~/modules/auth";
import { FormLabel } from "~/components/Forms";
import { Modal } from "~/components";

const SiteSchema = z.object({
   siteName: z.string().min(3, "Name is too short."),
   siteIcon: z
      .any()
      .refine((file) => file?.size <= 500000, `Max image size is 5MB.`)
      .refine(
         (file) =>
            ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
               file?.type
            ),
         "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),
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

   //Image preview after upload
   const [, setPicture] = useState(null);
   const [imgData, setImgData] = useState(null);
   const onChangePicture = (e: any) => {
      if (e.target.files[0]) {
         setPicture(e.target.files[0]);
         const reader = new FileReader() as any;
         reader.addEventListener("load", () => {
            setImgData(reader.result);
         });
         reader.readAsDataURL(e.target.files[0]);
      }
   };

   const adding = isAdding(transition, "addSite");
   const formResponse = useActionData<FormResponse>();
   const zo = useZorm("newSite", SiteSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   useEffect(() => {
      if (!adding) {
         //@ts-ignore
         zo.refObject.current && zo.refObject.current.reset();
         setImgData(null);
         setIsOpen(false);
      }
   }, [adding, zo.refObject]);

   return (
      <>
         <div className="flex items-center justify-center">
            <button
               className="bg-3 shadow-1 text-1 flex h-8 w-8 items-center justify-center
               rounded-full shadow-sm transition duration-300 active:translate-y-0.5 laptop:h-14 laptop:w-14"
               type="button"
               aria-label="Create New Site"
               onClick={() => setIsOpen(true)}
            >
               <Plus className="h-6 w-6 " />
            </button>
         </div>
         <Modal
            onClose={() => {
               setIsOpen(false);
            }}
            show={isOpen}
         >
            <div
               className="bg-2 mx-5 max-w-md transform rounded-2xl
               p-6 text-left align-middle shadow-xl transition-all"
            >
               <LoggedOut>
                  <div className="space-y-2 pb-8 pt-6">
                     <div className="text-center font-header text-xl font-bold">
                        Login to create a new wiki on Mana!
                     </div>
                     <div className="text-1 text-center">
                        Mana is currently in its early stages of development.
                        Learn more{" "}
                        <a
                           className="text-blue-500"
                           href="https://mana.wiki/hq"
                        >
                           here
                        </a>
                        .
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
                        // to={`/login?redirectTo=${location.pathname}`}
                     >
                        {t("login.action", { ns: "auth" })}
                     </Link>
                  </div>
               </LoggedOut>
               <LoggedIn>
                  <div className="pb-6 pt-4 text-center">
                     <div className="pb-1 font-header text-xl font-bold">
                        Create a new site
                     </div>
                     <p className="text-1 px-3 text-sm">
                        You can update both the name and icon later. A square
                        image with a 1:1 aspect ratio is recommended.
                     </p>
                  </div>
                  <Form
                     ref={zo.ref}
                     method="post"
                     action="/action/new-site-modal"
                     encType="multipart/form-data"
                     replace
                  >
                     <div className="flex items-center justify-center pb-4">
                        <label className="cursor-pointer">
                           {imgData ? (
                              <div
                                 className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden 
                                                            rounded-full"
                              >
                                 <img
                                    width={80}
                                    height={80}
                                    className="aspect-square object-contain"
                                    alt="preview"
                                    src={imgData}
                                 />
                              </div>
                           ) : (
                              <div
                                 className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-dashed
                                                            border-zinc-500 bg-white hover:border-zinc-700 hover:bg-zinc-100
                                                            dark:bg-zinc-600 dark:hover:border-zinc-400"
                              >
                                 <ImagePlus className="h-5 w-5 text-zinc-400" />
                              </div>
                           )}
                           <input
                              //@ts-ignore
                              name={zo.fields.siteIcon()}
                              type="file"
                              className="hidden"
                              onChange={onChangePicture}
                           />
                        </label>
                     </div>
                     <fieldset className="pb-5">
                        <FormLabel
                           htmlFor={zo.fields.siteName()}
                           text={t("new.siteName")}
                           error={zo.errors.siteName((err) => err.message)}
                        />
                        <div className="mt-1">
                           <input
                              required
                              autoFocus={true}
                              name={zo.fields.siteName()}
                              type="text"
                              className="input-text"
                              disabled={disabled}
                           />
                        </div>
                     </fieldset>
                     <button
                        name="intent"
                        value="addSite"
                        type="submit"
                        className="h-11 w-full rounded bg-zinc-500 px-4 text-white hover:bg-zinc-600 focus:bg-zinc-400"
                        disabled={disabled}
                     >
                        {adding ? (
                           <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                        ) : (
                           t("new.action")
                        )}
                     </button>
                  </Form>
               </LoggedIn>
               <button
                  name="intent"
                  value="addSite"
                  type="button"
                  className="absolute right-2 top-2 flex h-9 w-9
                              items-center justify-center rounded-full
                            hover:bg-red-50 dark:hover:bg-zinc-700"
                  onClick={() => setIsOpen(false)}
               >
                  <X className="h-6 w-6 text-red-400" />
               </button>
            </div>
         </Modal>
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

   const issues = createCustomIssues(SiteSchema);

   const result = await getMultipleFormData({
      request,
      prefix: "siteIcon",
      schema: SiteSchema,
   });

   if (result.success) {
      const { siteName, siteIcon } = result.data;
      try {
         const icon = await uploadImage({ payload, image: siteIcon, user });
         const userId = user.id;
         const siteId = safeNanoID();
         await payload.create({
            collection: "sites",
            data: {
               name: siteName,
               owner: userId,
               id: siteId,
               slug: siteId,
               icon: icon.id,
               type: "core",
            },
            overrideAccess: false,
            user,
         });

         //We need to get the current sites of the user, then prepare the new sites array
         const userCurrentSites = user?.sites || [];
         const sites = userCurrentSites.map((site) =>
            typeof site === "string" ? site : site?.id
         );

         //Finally we update the user with the new site id
         await payload.update({
            collection: "users",
            id: userId,
            data: { sites: [...sites, siteId] },
            overrideAccess: false,
            user,
         });

         return redirect(`/${siteId}`);
      } catch (error) {
         return json({
            error: "Something went wrong...unable to create new site.",
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
      error: "Something went wrong...unable to create new site",
   });
};
