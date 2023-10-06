import { useEffect, useState } from "react";

import { Switch } from "@headlessui/react";
import { type ActionFunction, type MetaFunction, json } from "@remix-run/node";
import {
   NavLink,
   Outlet,
   useFetcher,
   useActionData,
   useMatches,
} from "@remix-run/react";
import clsx from "clsx";
import {
   ChevronDown,
   ChevronLeft,
   ChevronRight,
   Database,
   Eye,
   EyeOff,
   ImagePlus,
   Link as LinkIcon,
   Pencil,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, useValue, useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import { Image } from "~/components/Image";
import type { Site } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import {
   assertIsPost,
   isProcessing,
   getMultipleFormData,
   uploadImage,
   isAdding,
   type FormResponse,
   slugify,
} from "~/utils";

import type { loader as siteDetailsLoader } from "../$siteId+/_layout";

const CollectionSchema = z.object({
   name: z.string().min(1).max(40),
   slug: z.string().min(1).max(40),
   icon: z.any(),
});

export const meta: MetaFunction<{
   "routes/_site+/$siteId+/_layout": typeof siteDetailsLoader;
}> = ({ matches }) => {
   const siteName = matches.find(
      ({ id }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site.name;
   return [
      {
         title: `Collections - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   i18n: "collection",
};

export default function CollectionIndex() {
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   const { t } = useTranslation(handle?.i18n);
   const fetcher = useFetcher();
   const disabled = isProcessing(fetcher.state);
   const adding = isAdding(fetcher, "addCollection");

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
   const formResponse = useActionData<FormResponse>();
   const zoCollection = useZorm("newCollection", CollectionSchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   useEffect(() => {
      if (!adding) {
         zoCollection.refObject.current &&
            zoCollection.refObject.current.reset();
         setImgData(null);
      }
   }, [adding, zoCollection.refObject]);

   const value = useValue({
      zorm: zoCollection,
      name: zoCollection.fields.name(),
   });
   const [collectionToggle, setCollectionToggle] = useState(false);

   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3">
            <div className="relative flex items-center pb-5 pt-2 laptop:-ml-0.5 laptop:-mr-1">
               <h1 className="font-header text-3xl font-bold pr-3">
                  Collections
               </h1>
               <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
               <AdminOrStaffOrOwner>
                  {!collectionToggle && (
                     <button
                        className="flex py-2.5 items-center text-xs font-bold gap-2 dark:border-zinc-600 dark:hover:border-zinc-500
                        border border-zinc-200 rounded-full hover:border-zinc-300 bg-zinc-50 dark:bg-dark450 px-4 shadow-sm shadow-1"
                        name="intent"
                        value="createPost"
                        type="submit"
                        onClick={() => setCollectionToggle(!collectionToggle)}
                     >
                        <Database className="text-zinc-400" size={13} />
                        New Collection
                     </button>
                  )}
                  {collectionToggle && (
                     <div className="flex items-center">
                        <button
                           className="flex items-center text-xs font-bold gap-2 dark:border-zinc-600 dark:hover:border-zinc-500 justify-center
                        border border-zinc-200 rounded-full hover:border-zinc-300 bg-zinc-50 dark:bg-dark450 w-7 h-7 shadow-sm shadow-1"
                           name="intent"
                           value="createPost"
                           type="submit"
                           onClick={() =>
                              setCollectionToggle(!collectionToggle)
                           }
                        >
                           <ChevronLeft
                              className="text-zinc-400 mr-0.5"
                              size={16}
                           />
                        </button>
                        <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full w-3 h-0.5" />
                        <button
                           className="flex py-2 items-center text-xs font-bold gap-2 dark:border-zinc-500 dark:hover:border-zinc-400
                           border border-zinc-200 rounded-full hover:bg-zinc-50 bg-white dark:bg-dark500 px-4 shadow-sm shadow-1"
                           name="intent"
                           value="createPost"
                           type="submit"
                           onClick={() =>
                              setCollectionToggle(!collectionToggle)
                           }
                        >
                           Add
                        </button>
                     </div>
                  )}
               </AdminOrStaffOrOwner>
            </div>
            {collectionToggle && (
               <AdminOrStaffOrOwner>
                  <fetcher.Form
                     ref={zoCollection.ref}
                     method="post"
                     encType="multipart/form-data"
                     className="pb-5"
                  >
                     <div className="flex items-center gap-4">
                        <div>
                           <label className="cursor-pointer">
                              {imgData ? (
                                 <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
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
                                    className="flex h-16 w-16 
                                items-center justify-center rounded-full border-2 border-dashed
                              border-color-sub bg-2-sub dark:hover:border-zinc-600"
                                 >
                                    <ImagePlus className="h-5 w-5 text-zinc-400" />
                                 </div>
                              )}
                              <input
                                 //@ts-ignore
                                 name={zoCollection.fields.icon()}
                                 type="file"
                                 className="hidden"
                                 onChange={onChangePicture}
                              />
                           </label>
                        </div>
                        <div className="flex-grow border-y py-1 border-color">
                           <section className="flex items-center justify-between">
                              <input
                                 placeholder={
                                    t("new.namePlaceholder") ?? undefined
                                 }
                                 name={zoCollection.fields.name()}
                                 type="text"
                                 className="input-text bg-3 h-8 focus:bg-3 border-0 p-0 mt-0"
                                 disabled={disabled}
                              />
                              <Toggle />
                           </section>
                           <section className="flex items-center justify-between">
                              <div className="flex items-center gap-2 space-y-1">
                                 <LinkIcon className="text-1" size={11} />
                                 <input
                                    readOnly
                                    name={zoCollection.fields.slug()}
                                    type="text"
                                    className="input-text h-6 focus:bg-3 pb-0.5 text-xs border-0 p-0 mt-0"
                                    disabled={disabled}
                                    value={slugify(value)}
                                 />
                              </div>
                              <div className="flex items-center gap-1">
                                 <div className="text-xs text-1 font-semibold">
                                    Advanced
                                 </div>
                                 <ChevronDown className="text-1" size={14} />
                              </div>
                           </section>
                        </div>
                        {/* <button
                        name="intent"
                        value="addCollection"
                        type="submit"
                        className="h-10 w-16 rounded-full dark:bg-zinc-500 text-sm font-bold"
                        disabled={disabled}
                     >
                        {adding ? (
                           <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                        ) : (
                           t("new.action")
                        )}
                     </button> */}
                     </div>
                  </fetcher.Form>
               </AdminOrStaffOrOwner>
            )}
            {site?.collections?.length === 0 ? null : (
               <>
                  <div className="border-color grid grid-cols-2 gap-3 laptop:grid-cols-3">
                     {site?.collections?.map((row, int) => (
                        <NavLink
                           key={row.relation?.value.slug}
                           to={`/${site.slug}/c/${row.relation?.value.slug}`}
                           prefetch="intent"
                           className={({ isActive }) =>
                              clsx(
                                 {
                                    "dark:border-zinc-600 dark:bg-dark450 bg-zinc-100 border-zinc-200":
                                       isActive,
                                 },
                                 "border-color-sub group bg-white dark:bg-dark350 relative shadow-1 flex items-center justify-between gap-2 rounded-xl border pr-2 shadow-sm transition",
                              )
                           }
                        >
                           <div className="flex items-center gap-2 truncate ">
                              <div
                                 className="border-color flex h-10 w-10 flex-none items-center
                                    justify-between overflow-hidden rounded-full p-1"
                              >
                                 {row.relation?.value?.icon?.url ? (
                                    <Image
                                       width={50}
                                       height={50}
                                       alt={
                                          row.relation?.value?.name ??
                                          "List Icon"
                                       }
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       url={row.relation?.value?.icon?.url}
                                       loading={int > 10 ? "lazy" : undefined}
                                    />
                                 ) : (
                                    <Database
                                       className="text-1 mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <span className="text-1 truncate text-sm font-bold">
                                 {row.relation?.value?.name}
                              </span>
                              <AdminOrStaffOrOwner>
                                 <button
                                    className="items-center justify-center absolute group-hover:flex hidden -top-2 w-6 h-6 
                                    border dark:border-zinc-600 rounded-full dark:bg-dark450 -left-2 shadow shadow-1"
                                 >
                                    <Pencil size={11} />
                                 </button>
                              </AdminOrStaffOrOwner>
                           </div>
                           <ChevronRight
                              size={20}
                              className="flex-none text-1"
                           />
                        </NavLink>
                     ))}
                  </div>
               </>
            )}
         </main>
         <Outlet />
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const issues = createCustomIssues(CollectionSchema);

   // Add Collection
   if (intent === "addCollection") {
      assertIsPost(request);
      const result = await getMultipleFormData({
         request,
         prefix: "cIcon",
         schema: CollectionSchema,
      });
      if (result.success) {
         const { name, slug, icon } = result.data;
         // TODO Make a database check here to check if the slug already exists
         if (slug === "exists") {
            issues.slug("Slug" + slug + "already exists ");
         }
         // Respond with custom issues that require checks on server
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 },
            );
         }
         const siteIcon = await uploadImage({
            payload,
            image: icon,
            user,
         });
         try {
            const sites = await payload.find({
               collection: "sites",
               where: {
                  slug: {
                     equals: siteId,
                  },
               },
               user,
            });
            const siteSlug = sites?.docs[0];
            await payload.create({
               collection: "collections",
               data: {
                  id: `${siteId}${slug}`,
                  name,
                  slug,
                  icon: siteIcon.id as any,
                  site: siteSlug?.id as any,
               },
               user,
               overrideAccess: false,
            });
            return json<FormResponse>({
               success: "New collection added",
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to add collection.",
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
         error: "Something went wrong...unable to add collection.",
      });
   }
};

function Toggle() {
   const [enabled, setEnabled] = useState(false);

   return (
      <Switch.Group>
         <div className="text-1 flex items-center gap-1.5">
            <Switch.Label className="flex-grow text-[10px] text-1">
               {enabled ? "Visible" : "Hidden"}
            </Switch.Label>
            <Switch
               checked={enabled}
               onChange={() => setEnabled(!enabled)}
               className="border-color-sub bg-3-sub relative inline-flex h-5 w-[42px] items-center rounded-full border"
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     enabled
                        ? "translate-x-[24px] dark:bg-zinc-300 bg-zinc-400"
                        : "translate-x-1 bg-zinc-300 dark:bg-zinc-500",
                     "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     enabled ? "left-1.5" : "right-1",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {enabled ? <Eye size={11} /> : <EyeOff size={11} />}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
}
