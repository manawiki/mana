import { useEffect } from "react";

import {
   type ActionFunction,
   type LoaderFunctionArgs,
   json,
   redirect,
} from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useSearchParams,
   useFetcher,
   useMatches,
   useParams,
} from "@remix-run/react";
import { request as gqlRequest, gql } from "graphql-request";
import {
   Component,
   Loader2,
   ChevronLeft,
   ChevronRight,
   Plus,
} from "lucide-react";
import { nanoid } from "nanoid";
import type { Payload } from "payload";
import { select } from "payload-query";
import { plural } from "pluralize";
import { useTranslation } from "react-i18next";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import type { Entry, Collection, User, Site } from "payload/generated-types";
import { Image } from "~/components/Image";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/src/components";
import {
   assertIsDelete,
   assertIsPost,
   getMultipleFormData,
   isAdding,
   toWords,
   uploadImage,
} from "~/utils";

import { List } from "./src/components";
import { customListMeta } from "./src/functions";

const EntrySchema = z.object({
   name: z.string(),
   collectionId: z.string(),
   siteId: z.string(),
});

const CollectionsAllSchema = z.object({
   q: z.string().optional(),
   page: z.coerce.number().optional(),
});

export { customListMeta as meta };

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

   const { entries } = await fetchEntries({
      collectionId,
      page,
      payload,
      siteId,
      user,
   });

   return json({ entries });
}

export const handle = {
   i18n: "entry",
};

export default function CollectionList() {
   const { entries } = useLoaderData<typeof loader>();

   // Paging Variables
   const [, setSearchParams] = useSearchParams({});

   const currentEntry = entries?.pagingCounter;
   const totalEntries = entries?.totalDocs;
   const totalPages = entries?.totalPages;
   const limit = entries?.limit;
   const hasNextPage = entries?.hasNextPage;
   const hasPrevPage = entries?.hasPrevPage;

   const { t } = useTranslation(handle?.i18n);

   // Form/fetcher
   const fetcher = useFetcher();
   const addingUpdate = isAdding(fetcher, "addEntry");
   const zoEntry = useZorm("newEntry", EntrySchema);

   //Site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };
   const { collectionId } = useParams();

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   useEffect(() => {
      //Reset form after submission
      if (!addingUpdate) {
         zoEntry.refObject.current && zoEntry.refObject.current.reset();
      }
   }, [addingUpdate, zoEntry.refObject]);

   return (
      <List>
         <div className="border-color-sub divide-color-sub shadow-sm shadow-1 divide-y overflow-hidden rounded-lg border">
            <AdminOrStaffOrOwner>
               {!collection?.customDatabase && (
                  <fetcher.Form
                     ref={zoEntry.ref}
                     className="dark:bg-dark350 bg-zinc-50 flex items-center justify-between pr-2.5"
                     method="post"
                  >
                     <input
                        required
                        placeholder={t("new.namePlaceholder") ?? undefined}
                        name={zoEntry.fields.name()}
                        type="text"
                        className="w-full bg-transparent text-sm h-12 focus:border-0 focus:ring-0 border-0"
                     />
                     <input
                        value={site?.id}
                        name={zoEntry.fields.siteId()}
                        type="hidden"
                     />
                     <input
                        value={collection?.id}
                        name={zoEntry.fields.collectionId()}
                        type="hidden"
                     />
                     <button
                        className="shadow-1 inline-flex h-[30px] w-[74px] items-center justify-center gap-1.5 bg-white dark:bg-dark450
                     rounded-full border border-zinc-200 dark:border-zinc-600 text-xs font-bold shadow-sm"
                        name="intent"
                        value="addEntry"
                        type="submit"
                     >
                        {addingUpdate ? (
                           <Loader2 size={16} className="animate-spin" />
                        ) : (
                           <>
                              <Plus
                                 className="text-zinc-400 dark:text-zinc-300"
                                 size={14}
                              />
                              <span className="text-1 pr-0.5">Add</span>
                           </>
                        )}
                     </button>
                  </fetcher.Form>
               )}
            </AdminOrStaffOrOwner>
            {entries.docs?.length > 0
               ? entries.docs?.map((entry: Entry, int: number) => (
                    <Link
                       key={entry.id}
                       to={entry.slug ?? entry.id}
                       // prefetch="intent" Enabling this makes hover perform weird
                       className="flex items-center gap-3 p-2 dark:odd:bg-dark350 odd:bg-zinc-50 group"
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
                             <Component className="text-1 mx-auto" size={18} />
                          )}
                       </div>
                       <span className="text-sm font-bold group-hover:underline">
                          {entry.name}
                       </span>
                    </Link>
                 ))
               : null}
         </div>
         {/* Pagination Section */}
         {totalPages > 1 && (
            <div className="text-1 flex items-center justify-between py-3 pl-1 text-sm">
               <div>
                  Showing <span className="font-bold">{currentEntry}</span> to{" "}
                  <span className="font-bold">
                     {limit + currentEntry - 1 > totalEntries
                        ? totalEntries
                        : limit + currentEntry - 1}
                  </span>{" "}
                  of <span className="font-bold">{totalEntries}</span> results
               </div>
               <div className="flex items-center gap-3 text-xs">
                  {hasPrevPage ? (
                     <button
                        className="flex items-center gap-1 font-semibold uppercase hover:underline"
                        onClick={() =>
                           setSearchParams((searchParams) => {
                              searchParams.set("page", entries.prevPage as any);
                              return searchParams;
                           })
                        }
                     >
                        <ChevronLeft size={18} className="text-zinc-500" />
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
                              searchParams.set("page", entries.nextPage as any);
                              return searchParams;
                           })
                        }
                     >
                        Next
                        <ChevronRight size={18} className="text-zinc-500" />
                     </button>
                  ) : null}
               </div>
            </div>
         )}
      </List>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
}) => {
   if (!user || !user.id) return redirect("/login", { status: 302 });

   const { intent } = await zx.parseForm(request, {
      intent: z.enum([
         "addEntry",
         "collectionUpdateIcon",
         "collectionDeleteIcon",
      ]),
   });

   switch (intent) {
      case "addEntry": {
         assertIsPost(request);
         const { name, collectionId, siteId } = await zx.parseForm(request, {
            name: z.string(),
            collectionId: z.string(),
            siteId: z.string(),
         });
         try {
            return await payload.create({
               collection: "entries",
               data: {
                  name,
                  id: nanoid(12),
                  author: user?.id as any,
                  collectionEntity: collectionId as any,
                  site: siteId as any,
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to add entry.",
            });
         }
      }
      case "collectionUpdateIcon": {
         assertIsPost(request);

         const result = await getMultipleFormData({
            request,
            prefix: "collectionIcon",
            schema: z.any(),
         });
         if (result.success) {
            const { image, entityId } = result.data;
            try {
               const upload = await uploadImage({
                  payload,
                  image: image,
                  user,
               });
               return await payload.update({
                  collection: "collections",
                  id: entityId,
                  data: {
                     icon: upload.id as any,
                  },
                  overrideAccess: false,
                  user,
               });
            } catch (error) {
               return json({
                  error: "Something went wrong...unable to add image.",
               });
            }
         }
         // Last resort error message
         return json({
            error: "Something went wrong...unable to add image.",
         });
      }
      case "collectionDeleteIcon": {
         assertIsDelete(request);
         const { imageId, entityId } = await zx.parseForm(request, {
            imageId: z.string(),
            entityId: z.string(),
         });
         await payload.delete({
            collection: "images",
            id: imageId,
            overrideAccess: false,
            user,
         });
         return await payload.update({
            collection: "collections",
            id: entityId,
            data: {
               icon: "" as any,
            },
            overrideAccess: false,
            user,
         });
      }
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
      return { entries };
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
               slug: true,
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

   return { entries: result };
}
