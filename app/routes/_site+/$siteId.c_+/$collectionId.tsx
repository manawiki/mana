import { Fragment, useEffect, useState } from "react";

import { Menu, Transition } from "@headlessui/react";
import {
   type ActionFunction,
   type LoaderFunctionArgs,
   type MetaFunction,
   json,
   redirect,
} from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useNavigation,
   useSearchParams,
   Form,
   useActionData,
   useMatches,
   NavLink,
} from "@remix-run/react";
import clsx from "clsx";
import { request as gqlRequest, gql } from "graphql-request";
import {
   Component,
   ImagePlus,
   Loader2,
   ChevronLeft,
   ChevronRight,
   Database,
} from "lucide-react";
import { nanoid } from "nanoid";
import type { Payload } from "payload";
import { select } from "payload-query";
import { plural } from "pluralize";
import { useTranslation } from "react-i18next";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import type { Entry, Collection, User, Site } from "payload/generated-types";
import { Image } from "~/components/Image";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import {
   assertIsPost,
   getMultipleFormData,
   uploadImage,
   type FormResponse,
   isAdding,
   isProcessing,
   toWords,
} from "~/utils";

const EntrySchema = z.object({
   name: z.string(),
   icon: z.any(),
});

const CollectionsAllSchema = z.object({
   q: z.string().optional(),
   page: z.coerce.number().optional(),
});

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { collectionId, siteId } = zx.parseParams(params, {
      collectionId: z.string(),
      siteId: z.string(),
   });

   const { page } = zx.parseQuery(request, CollectionsAllSchema);

   const { entries, collection } = await fetchEntries({
      collectionId,
      page,
      payload,
      siteId,
      user,
   });

   return json({ entries, collection });
}

export const meta: MetaFunction = ({ data, matches }) => {
   const siteName = matches.find(
      ({ id }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site?.name;
   //@ts-ignore
   const collectionName = data.collection.name;

   return [
      {
         title: `${collectionName} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const handle = {
   i18n: "entry",
};

export default function CollectionList() {
   const { entries, collection } = useLoaderData<typeof loader>();

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   // Paging Variables
   const [, setSearchParams] = useSearchParams({});

   const currentEntry = entries?.pagingCounter;
   const totalEntries = entries?.totalDocs;
   const totalPages = entries?.totalPages;
   const limit = entries?.limit;
   const hasNextPage = entries?.hasNextPage;
   const hasPrevPage = entries?.hasPrevPage;

   const transition = useNavigation();
   const disabled = isProcessing(transition.state);
   const { t } = useTranslation(handle?.i18n);

   //Image preview after upload
   const [, setPicture] = useState(null);
   const [imgData, setImgData] = useState(null);

   const adding = isAdding(transition, "addEntry");
   const formResponse = useActionData<FormResponse>();
   const zoEntry = useZorm("newEntry", EntrySchema, {
      //@ts-ignore
      customIssues: formResponse?.serverIssues,
   });

   function onChangePicture(e: any) {
      if (e.target.files[0]) {
         setPicture(e.target.files[0]);
         const reader = new FileReader() as any;
         reader.addEventListener("load", () => {
            setImgData(reader.result);
         });
         reader.readAsDataURL(e.target.files[0]);
      }
   }

   useEffect(() => {
      if (!adding) {
         //@ts-ignore
         zoEntry.refObject.current && zoEntry.refObject.current.reset();
         setImgData(null);
      }
   }, [adding, zoEntry.refObject]);

   return (
      <>
         <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:pb-12">
            <div className="flex items-center justify-between gap-2 pb-2">
               <h1 className="font-bold font-header text-2xl">
                  {collection?.name}
               </h1>
               <div className="flex-none border border-color shadow-1 shadow-sm bg-white dark:bg-zinc-800 -mb-8 flex h-14 w-14 rounded-full overflow-hidden items-center">
                  {collection?.icon ? (
                     <Image
                        url={collection.icon}
                        options="aspect_ratio=1:1&height=80&width=80"
                        alt="Collection Icon"
                     />
                  ) : (
                     <Component className="text-1 mx-auto" size={18} />
                  )}
               </div>
            </div>
            {/* <h1 className="font-bold font-header text-2xl pb-2">
               {collection.name}
            </h1> */}
            <CollectionCrumbs site={site} collection={collection} />
            <AdminOrStaffOrOwner>
               <Form
                  ref={zoEntry.ref}
                  method="post"
                  encType="multipart/form-data"
                  className="mt-4 pb-3.5 hidden"
                  replace
               >
                  <div className="flex items-center gap-4">
                     <div>
                        <label className="cursor-pointer">
                           {imgData ? (
                              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
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
                                 className="flex h-11 w-11 
                                    items-center justify-center rounded-full border-2 border-dashed
                                  border-zinc-400 bg-white hover:border-zinc-600 hover:bg-zinc-100 dark:border-zinc-500
                                  dark:bg-zinc-600 dark:hover:border-zinc-400"
                              >
                                 <ImagePlus className="h-5 w-5 text-zinc-400" />
                              </div>
                           )}
                           <input
                              //@ts-ignore
                              name={zoEntry.fields.icon()}
                              type="file"
                              className="hidden"
                              onChange={onChangePicture}
                           />
                        </label>
                     </div>
                     <div className="flex-grow">
                        <input
                           required
                           placeholder={t("new.namePlaceholder") ?? undefined}
                           autoFocus={true}
                           name={zoEntry.fields.name()}
                           type="text"
                           className="input-text bg-2 mt-0"
                           disabled={disabled}
                        />
                        {zoEntry.errors.name()?.message && (
                           <div
                              className="pt-1 text-red-700"
                              id="entryName-error"
                           >
                              {zoEntry.errors.name()?.message}
                           </div>
                        )}
                     </div>
                     <button
                        name="intent"
                        value="addEntry"
                        type="submit"
                        className="h-10 w-16 rounded bg-zinc-500 px-4 text-sm font-bold 
                        text-white hover:bg-zinc-600 focus:bg-zinc-400"
                        disabled={disabled}
                     >
                        {adding ? (
                           <Loader2 className="mx-auto h-5 w-5 animate-spin text-zinc-300" />
                        ) : (
                           t("new.action")
                        )}
                     </button>
                  </div>
               </Form>
            </AdminOrStaffOrOwner>
            {entries.docs?.length === 0 ? null : (
               <>
                  <div className="border-color-sub divide-color-sub shadow-sm shadow-1 divide-y overflow-hidden rounded-lg border">
                     {entries.docs?.map((entry: Entry, int: number) => (
                        <Link
                           key={entry.id}
                           to={entry.id}
                           // prefetch="intent" Enabling this makes hover perform weird
                           className="flex items-center gap-3 p-2 dark:odd:bg-dark350 odd:bg-zinc-50  group"
                        >
                           <div
                              className="border-color-sub shadow-1 flex h-8 w-8 items-center justify-between
                                    overflow-hidden rounded-full border bg-3-sub shadow-sm"
                           >
                              {entry.icon?.url ? (
                                 <Image /* @ts-ignore */
                                    url={entry.icon?.url}
                                    options="aspect_ratio=1:1&height=80&width=80"
                                    alt={entry.name ?? "Entry Icon"}
                                    loading={int > 10 ? "lazy" : undefined}
                                 />
                              ) : (
                                 <Component
                                    className="text-1 mx-auto"
                                    size={18}
                                 />
                              )}
                           </div>
                           <span className="text-sm font-bold group-hover:underline">
                              {entry.name}
                           </span>
                        </Link>
                     ))}
                  </div>
                  {/* Pagination Section */}
                  {totalPages > 1 && (
                     <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
                        <div>
                           Showing{" "}
                           <span className="font-bold">{currentEntry}</span> to{" "}
                           <span className="font-bold">
                              {limit + currentEntry - 1 > totalEntries
                                 ? totalEntries
                                 : limit + currentEntry - 1}
                           </span>{" "}
                           of <span className="font-bold">{totalEntries}</span>{" "}
                           results
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                           {hasPrevPage ? (
                              <button
                                 className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                 onClick={() =>
                                    setSearchParams((searchParams) => {
                                       searchParams.set(
                                          "page",
                                          entries.prevPage as any,
                                       );
                                       return searchParams;
                                    })
                                 }
                              >
                                 <ChevronLeft
                                    size={18}
                                    className="text-zinc-500"
                                 />
                                 Prev
                              </button>
                           ) : null}
                           {hasNextPage && hasPrevPage && (
                              <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                           )}
                           {hasNextPage ? (
                              <button
                                 className="flex items-center gap-1 font-semibold uppercase hover:underline"
                                 onClick={() =>
                                    setSearchParams((searchParams) => {
                                       searchParams.set(
                                          "page",
                                          entries.nextPage as any,
                                       );
                                       return searchParams;
                                    })
                                 }
                              >
                                 Next
                                 <ChevronRight
                                    size={18}
                                    className="text-zinc-500"
                                 />
                              </button>
                           ) : null}
                        </div>
                     </div>
                  )}
               </>
            )}
         </div>
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   if (!user || !user.id) return redirect("/login", { status: 302 });

   const { collectionId, siteId } = zx.parseParams(params, {
      collectionId: z.string(),
      siteId: z.string(),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   const issues = createCustomIssues(EntrySchema);

   // Add Entry
   if (intent === "addEntry") {
      assertIsPost(request);

      const result = await getMultipleFormData({
         request,
         prefix: "eIcon",
         schema: EntrySchema,
      });

      if (result.success) {
         const { name, icon } = result.data;
         // Respond with custom issues that require checks on server
         if (issues.hasIssues()) {
            return json<FormResponse>(
               { serverIssues: issues.toArray() },
               { status: 400 },
            );
         }
         const iconId = await uploadImage({
            payload,
            image: icon,
            user,
         });
         try {
            const siteData = await payload.find({
               collection: "sites",
               where: {
                  slug: {
                     equals: siteId,
                  },
               },
               user,
            });
            const site = siteData?.docs[0];
            await payload.create({
               collection: "entries",
               data: {
                  name,
                  id: nanoid(12),
                  author: user?.id as any,
                  icon: iconId.id as any,
                  collectionEntity: (siteId + collectionId) as any,
                  site: site?.id as any,
               },
               user,
               overrideAccess: false,
            });
            return json<FormResponse>({
               success: "New entry added.",
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to add entry.",
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
         error: "Something went wrong...unable to add entry.",
      });
   }
};

async function fetchEntries({
   page = 1,
   payload,
   siteId,
   user,
   collectionId,
}: typeof CollectionsAllSchema._type & {
   payload: Payload;
   collectionId: Collection["slug"];
   siteId: Site["slug"];
   user?: User;
}) {
   const collectionData = await payload.find({
      collection: "collections",
      where: {
         "site.slug": {
            equals: siteId,
         },
         slug: {
            equals: collectionId,
         },
      },
      overrideAccess: false,
      user,
   });

   const collectionEntry = collectionData?.docs[0];

   const collection = {
      name: collectionEntry?.name,
      icon: collectionEntry?.icon?.url,
   };

   // Get custom collection list data
   if (collectionEntry?.customDatabase) {
      const formattedName = plural(toWords(collectionId, true));

      const document = gql`
         query($page: Int!) {
            entries: ${formattedName}(page: $page, limit: 20) {
            totalDocs
            totalPages
            limit
            pagingCounter
            hasPrevPage
            prevPage
            nextPage
            hasNextPage
            docs {
               id
               name
               icon {
                  url
               }
            }
            }
         }
      `;

      const endpoint = `https://${collectionEntry?.site.slug}-db.${
         collectionEntry?.site?.domain ?? "mana.wiki"
      }/api/graphql`;

      const { entries }: any = await gqlRequest(endpoint, document, { page });
      return { entries, collection };
   }

   //Otherwise pull data from core
   const data = await payload.find({
      collection: "entries",
      where: {
         site: {
            equals: collectionEntry?.site?.id,
         },
         "collectionEntity.slug": {
            equals: collectionId,
         },
      },
      depth: 1,
      overrideAccess: false,
      user,
   });

   const filtered = data.docs.map((doc) => {
      return {
         ...select(
            {
               id: true,
               name: true,
            },
            doc,
         ),
         icon: doc.icon && select({ id: false, url: true }, doc.icon),
      };
   });

   //Extract pagination fields
   const { docs, ...pagination } = data;

   //Combine filtered docs with pagination info
   const result = { docs: filtered, ...pagination };

   return { entries: result, collection };
}

export function CollectionCrumbs({
   site,
   collection,
   entry,
}: {
   site: Site;
   collection: Collection;
   entry?: Entry;
}) {
   return (
      <section className="py-1.5 flex items-center gap-3 border-y dark:border-dark400 border-zinc-100 mb-4">
         <Link
            to={`/${site?.slug}/collections`}
            className="flex items-center gap-2 group"
         >
            <Database
               className="hover:text-zinc-500 dark:hover:text-zinc-400 text-zinc-400 dark:text-zinc-500"
               size={16}
            />
         </Link>
         <span className="text-zinc-200 text-xl dark:text-zinc-700">/</span>
         <Menu as="div" className="relative">
            {({ open }) => (
               <>
                  <Menu.Button className="flex items-center gap-2 group focus:outline-none">
                     <span className="font-bold text-1 text-xs group-focus:underline group-hover:underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-4">
                        {collection.name}
                     </span>
                     <span className="w-4 h-4 flex items-center justify-center">
                        <svg
                           className={`${
                              open ? "rotate-180" : ""
                           } transform transition duration-300 fill-zinc-400 dark:fill-zinc-500 ease-in-out w-3.5 h-3.5`}
                           viewBox="0 0 320 512"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                        </svg>
                     </span>
                  </Menu.Button>
                  <Transition
                     as={Fragment}
                     enter="transition ease-out duration-200"
                     enterFrom="opacity-0 translate-y-1"
                     enterTo="opacity-100 translate-y-0"
                     leave="transition ease-in duration-150"
                     leaveFrom="opacity-100 translate-y-0"
                     leaveTo="opacity-0 translate-y-1"
                  >
                     <Menu.Items className="absolute left-0 mt-1.5 max-w-sm min-w-[140px] w-full">
                        <div className="overflow-hidden p-1.5 space-y-0.5 rounded-lg bg-white dark:bg-dark350 border border-color-sub shadow-1 shadow">
                           {site?.collections?.map((row) => (
                              <Menu.Item key={row.slug}>
                                 <NavLink
                                    end
                                    className={({ isActive }) =>
                                       clsx(
                                          isActive
                                             ? "bg-zinc-100 dark:bg-dark450"
                                             : "hover:bg-zinc-50 dark:hover:bg-dark400",
                                          "flex items-center p-1 rounded-md gap-1.5",
                                       )
                                    }
                                    to={`/${site.slug}/c/${row.slug}`}
                                 >
                                    <span className="flex-none flex h-5 w-5 items-center">
                                       {row.icon?.url ? (
                                          <Image
                                             url={row.icon?.url}
                                             options="aspect_ratio=1:1&height=80&width=80"
                                             alt="Collection Icon"
                                          />
                                       ) : (
                                          <Component
                                             className="text-1 mx-auto"
                                             size={18}
                                          />
                                       )}
                                    </span>
                                    <span className="text-xs font-semibold text-1">
                                       {row.name}
                                    </span>
                                 </NavLink>
                              </Menu.Item>
                           ))}
                        </div>
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>
         <span className="text-zinc-200 text-xl dark:text-zinc-700">/</span>
         <span className="font-bold text-1 text-xs flex items-center gap-2">
            {entry ? "Entry" : "Collection"}
         </span>
      </section>
   );
}
