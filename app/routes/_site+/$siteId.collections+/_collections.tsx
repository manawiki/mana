import { Fragment, useEffect, useState } from "react";

import { Popover, Switch } from "@headlessui/react";
import {
   type ActionFunction,
   type MetaFunction,
   json,
   redirect,
} from "@remix-run/node";
import { Link, Outlet, useFetcher, useMatches } from "@remix-run/react";
import clsx from "clsx";
import {
   ChevronDown,
   ChevronRight,
   Database,
   ImagePlus,
   Link as LinkIcon,
   Loader2,
   X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Zorm } from "react-zorm";
import { useValue, useZorm } from "react-zorm";
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
   slugify,
   setSuccessMessage,
   getSession,
   commitSession,
   setErrorMessage,
} from "~/utils";

import { mainContainerStyle } from "../$siteId+/_index";

const CollectionSchema = z.object({
   name: z.string().min(1).max(40),
   slug: z.string().min(1).max(40),
   hiddenCollection: z.coerce.boolean(),
   customListTemplate: z.coerce.boolean(),
   customEntryTemplate: z.coerce.boolean(),
   customDatabase: z.coerce.boolean(),
   icon: z.any(),
});

export const meta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   );
   const siteName = site?.data?.site.name;
   return [
      {
         title: `Collections - ${siteName}`,
      },
   ];
};

export const handle = {
   i18n: "collection",
};

function SlugField({ zo }: { zo: Zorm<typeof CollectionSchema> }) {
   const value = useValue({
      zorm: zo,
      name: zo.fields.name(),
   });
   return (
      <input
         readOnly
         name={zo.fields.slug()}
         type="text"
         className="input-text h-6 focus:bg-3 pb-0.5 text-xs border-0 p-0 mt-0"
         value={slugify(value)}
      />
   );
}

export default function CollectionIndex() {
   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   //Show/hide the collection creation form
   const [collectionToggle, setCollectionToggle] = useState(false);

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

   const zoCollection = useZorm("newCollection", CollectionSchema);

   // Reset the form after submission
   useEffect(() => {
      if (!adding) {
         zoCollection.refObject.current &&
            zoCollection.refObject.current.reset();
         setImgData(null);
      }
   }, [adding, zoCollection.refObject]);

   return (
      <>
         <main className={mainContainerStyle}>
            <div className="relative flex items-center pb-3">
               <h1 className="font-header text-2xl laptop:text-3xl font-bold pr-3">
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
                     <button
                        className="flex items-center text-xs font-bold gap-2 dark:border-zinc-600 dark:hover:border-zinc-500 justify-center
                        border border-zinc-200 rounded-full hover:border-zinc-300 bg-zinc-50 dark:bg-dark450 w-7 h-7 shadow-sm shadow-1"
                        name="intent"
                        value="createPost"
                        onClick={() => setCollectionToggle(!collectionToggle)}
                     >
                        <X className="text-zinc-400" size={16} />
                     </button>
                  )}
               </AdminOrStaffOrOwner>
            </div>
            {collectionToggle && (
               <AdminOrStaffOrOwner>
                  <fetcher.Form
                     ref={zoCollection.ref}
                     method="post"
                     encType="multipart/form-data"
                     className="pb-8"
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
                              <Popover className="relative">
                                 {({ open }) => (
                                    <>
                                       <Popover.Button className="flex group items-center gap-1 text-1">
                                          <div className="text-xs group-hover:underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 font-semibold">
                                             Advanced
                                          </div>
                                          <ChevronDown
                                             className={clsx(
                                                open ? "rotate-180" : "",
                                                "transform transition duration-300 ease-in-out w-3.5 h-3.5",
                                             )}
                                             size={14}
                                          />
                                       </Popover.Button>
                                       <Popover.Panel
                                          static
                                          className={clsx(
                                             open
                                                ? "opacity-1 z-20"
                                                : "opacity-0",
                                             "absolute right-0 mt-2 max-w-sm min-w-[200px] w-full",
                                          )}
                                       >
                                          <div className="overflow-hidden pr-2.5 pl-3 py-2 rounded-lg bg-zinc-50 dark:border-zinc-700 dark:bg-dark400 border border-zinc-200/80 shadow-1 shadow">
                                             <ToggleAdvanced
                                                label="Hide Collection"
                                                name="hiddenCollection"
                                             />
                                             <div className="flex items-center pb-1.5 pt-3 gap-2">
                                                <div className="text-xs font-bold">
                                                   Custom
                                                </div>
                                                <span className="flex-grow h-[1px] dark:bg-dark450 bg-zinc-200 rounded-full" />
                                             </div>
                                             <div className="space-y-2">
                                                <ToggleAdvanced
                                                   label="List Template"
                                                   name="customListTemplate"
                                                />
                                                <ToggleAdvanced
                                                   label="Entry Template"
                                                   name="customEntryTemplate"
                                                />
                                                <ToggleAdvanced
                                                   label="Data Schema"
                                                   name="customDatabase"
                                                />
                                             </div>
                                          </div>
                                       </Popover.Panel>
                                    </>
                                 )}
                              </Popover>
                           </section>
                           <section className="flex items-center justify-between relative">
                              <div className="flex items-center gap-2 space-y-1">
                                 <LinkIcon className="text-1" size={11} />
                                 <SlugField zo={zoCollection} />
                              </div>
                              <button
                                 className="absolute right-0 -bottom-5 flex py-1.5 items-center text-xs font-bold gap-2 dark:border-zinc-500 dark:hover:border-zinc-400
                                 border border-zinc-200 rounded-full hover:bg-zinc-50 bg-white dark:bg-dark500 px-3 shadow-sm shadow-1"
                                 name="intent"
                                 value="addCollection"
                                 type="submit"
                                 disabled={disabled}
                              >
                                 {adding ? (
                                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                                 ) : (
                                    t("new.action")
                                 )}
                              </button>
                           </section>
                        </div>
                     </div>
                  </fetcher.Form>
               </AdminOrStaffOrOwner>
            )}
            {site?.collections?.length === 0 ? null : (
               <>
                  <div className="border-color-sub divide-y shadow-sm shadow-1 overflow-hidden divide-color-sub rounded-lg border">
                     {site?.collections?.map((row, int) => (
                        <Link
                           key={row.slug}
                           to={`/${site.slug}/c/${row.slug}`}
                           className="group relative flex items-center odd:bg-2-sub justify-between gap-2 p-2"
                        >
                           <div className="flex items-center gap-3">
                              <div className="border-color-sub border shadow-sm shadow-1 flex h-8 w-8 flex-none items-center overflow-hidden rounded-full">
                                 {row.icon?.url ? (
                                    <Image
                                       width={50}
                                       height={50}
                                       alt={row.name ?? "List Icon"}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       url={row?.icon?.url}
                                       loading={int > 10 ? "lazy" : undefined}
                                    />
                                 ) : (
                                    <Database
                                       className="text-1 mx-auto"
                                       size={18}
                                    />
                                 )}
                              </div>
                              <span className="group-hover:underline truncate text-sm font-bold">
                                 {row.name}
                              </span>
                              {/* <AdminOrStaffOrOwner>
                                 <button
                                    className="items-center justify-center absolute group-hover:flex hidden -top-2 w-6 h-6 
                                    border dark:border-zinc-600 rounded-full dark:bg-dark450 right-2 shadow shadow-1"
                                 >
                                    <Pencil size={11} />
                                 </button>
                              </AdminOrStaffOrOwner> */}
                           </div>
                           <ChevronRight
                              size={20}
                              className="flex-none text-1"
                           />
                        </Link>
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

   const session = await getSession(request.headers.get("cookie"));

   // Add Collection

   switch (intent) {
      case "deleteCollection": {
      }
      case "updateCollection": {
      }
      case "addCollection": {
         assertIsPost(request);
         const result = await getMultipleFormData({
            request,
            prefix: "cIcon",
            schema: CollectionSchema,
         });

         if (result.success) {
            const {
               name,
               slug,
               icon,
               hiddenCollection,
               customListTemplate,
               customEntryTemplate,
               customDatabase,
            } = result.data;

            try {
               //See if duplicate exists on the same site
               const existingSlug = await payload.find({
                  collection: "collections",
                  where: {
                     "site.slug": {
                        equals: siteId,
                     },
                     slug: {
                        equals: slug,
                     },
                  },
                  overrideAccess: false,
                  user,
               });

               if (existingSlug.totalDocs > 0) {
                  setErrorMessage(session, "Slug" + slug + "already exists ");
                  return redirect(`/${siteId}/collections`, {
                     headers: { "Set-Cookie": await commitSession(session) },
                  });
               }

               //We need to get the real site ID from the siteId slug
               const siteData = await payload.find({
                  collection: "sites",
                  where: {
                     slug: {
                        equals: siteId,
                     },
                  },
                  user,
               });
               const immutableSiteId = siteData?.docs[0]?.id;

               const siteIcon = await uploadImage({
                  payload,
                  image: icon,
                  user,
               });

               if (siteIcon) {
                  await payload.create({
                     collection: "collections",
                     data: {
                        id: `${siteId}${slug}`,
                        name,
                        slug,
                        icon: siteIcon.id as any,
                        site: immutableSiteId as any,
                        hiddenCollection,
                        customListTemplate,
                        customEntryTemplate,
                        customDatabase,
                     },
                     user,
                     overrideAccess: false,
                  });

                  setSuccessMessage(session, "Collection added");
                  return redirect(`/${siteId}/collections`, {
                     headers: { "Set-Cookie": await commitSession(session) },
                  });
               }
            } catch (error) {
               payload.logger.error(`${error}`);
               setErrorMessage(
                  session,
                  "Something went wrong...unable to add collection.",
               );
               return redirect(`/${siteId}/collections`, {
                  headers: { "Set-Cookie": await commitSession(session) },
               });
            }
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to add collection.",
         });
      }
   }
};

function ToggleAdvanced({
   label,
   name,
   defaultVisibility = false,
}: {
   label: string;
   name: string;
   defaultVisibility?: boolean;
}) {
   return (
      <Switch.Group>
         <div className="flex items-center group">
            <Switch.Label
               className="flex-grow cursor-pointer dark:text-zinc-400 text-zinc-500  group-hover:underline 
               decoration-zinc-300 dark:decoration-zinc-600 underline-offset-2 text-xs"
            >
               {label}
            </Switch.Label>
            <Switch
               defaultChecked={defaultVisibility}
               as={Fragment}
               name={name}
               value="true"
            >
               {({ checked }) => (
                  <div className="dark:border-zinc-600/60 bg-white dark:bg-dark350 relative flex-none flex h-5 w-[36px] items-center rounded-full border">
                     <span className="sr-only">{label}</span>
                     <div
                        className={clsx(
                           checked
                              ? "translate-x-[18px] dark:bg-zinc-300 bg-zinc-400"
                              : "translate-x-1 bg-zinc-300 dark:bg-zinc-500",
                           "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition",
                        )}
                     />
                  </div>
               )}
            </Switch>
         </div>
      </Switch.Group>
   );
}
