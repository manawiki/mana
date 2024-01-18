import { useEffect } from "react";

import { arrayMove } from "@dnd-kit/sortable";
import { json, redirect } from "@remix-run/node";
import type {
   SerializeFrom,
   ActionFunction,
   LoaderFunctionArgs,
} from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useSearchParams,
   useFetcher,
   useParams,
   useRouteLoaderData,
} from "@remix-run/react";
import { nanoid } from "nanoid";
import { useZorm } from "react-zorm";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import type { Entry } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import type { loader as siteLoaderType } from "~/routes/_site+/_layout";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { isAdding } from "~/utils/form";
import {
   assertIsDelete,
   assertIsPatch,
   assertIsPost,
} from "~/utils/http.server";
import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";

import { fetchListCore } from "./utils/fetchListCore.server";
import { listMeta } from "./utils/listMeta";
import { SectionSchema } from "../$collectionId_.$entryId/components/Sections";
import { List } from "../_components/List";

const EntrySchema = z.object({
   name: z.string(),
   collectionId: z.string(),
   siteId: z.string(),
});

export const CollectionsAllSchema = z.object({
   q: z.string().optional(),
   page: z.coerce.number().optional(),
});

export { listMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { collectionId } = zx.parseParams(params, {
      collectionId: z.string(),
   });

   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { page } = zx.parseQuery(request, CollectionsAllSchema);

   const { entries } = await fetchListCore({
      collectionId,
      page,
      payload,
      siteSlug,
      user,
   });

   return json({ entries });
}

export default function CollectionList() {
   const { entries } = useLoaderData<typeof loader>();

   //Paging Variables
   const [, setSearchParams] = useSearchParams({});

   const currentEntry = entries?.pagingCounter;
   const totalEntries = entries?.totalDocs;
   const totalPages = entries?.totalPages;
   const limit = entries?.limit;
   const hasNextPage = entries?.hasNextPage;
   const hasPrevPage = entries?.hasPrevPage;

   //Form/fetcher
   const fetcher = useFetcher();
   const addingUpdate = isAdding(fetcher, "addEntry");
   const zoEntry = useZorm("newEntry", EntrySchema);

   const { site } = useRouteLoaderData("routes/_site+/_layout") as {
      site: SerializeFrom<typeof siteLoaderType>["site"];
   };

   const { collectionId } = useParams();

   const collection = site?.collections?.find(
      (collection) => collection.slug === collectionId,
   );

   //Reset form after submission
   useEffect(() => {
      if (!addingUpdate) {
         zoEntry.refObject.current && zoEntry.refObject.current.reset();
      }
   }, [addingUpdate, zoEntry.refObject]);

   return (
      <List>
         <section className="relative">
            <AdminOrStaffOrOwner>
               {/* Add new entry */}
               {!collection?.customDatabase && (
                  <div className="pt-1">
                     <fetcher.Form
                        ref={zoEntry.ref}
                        className="dark:bg-dark350 border focus-within:border-zinc-200 dark:focus-within:border-zinc-600 border-color-sub rounded-lg 
                     shadow-sm shadow-1 mb-3 bg-zinc-50 flex items-center justify-between pr-2.5"
                        method="post"
                     >
                        <input
                           required
                           placeholder="Type an entry name..."
                           name={zoEntry.fields.name()}
                           type="text"
                           className="w-full bg-transparent pl-4 text-sm h-12 focus:border-0 focus:ring-0 border-0"
                        />
                        <input
                           value={collection?.id}
                           name={zoEntry.fields.collectionId()}
                           type="hidden"
                        />
                        <input
                           value={site?.id}
                           name={zoEntry.fields.siteId()}
                           type="hidden"
                        />
                        <button
                           className="shadow-1 inline-flex h-[30px] items-center justify-center gap-1.5 w-[78px] bg-white dark:bg-dark450
                     rounded-full border border-zinc-200 dark:hover:border-zinc-500 hover:border-zinc-300 dark:border-zinc-600 text-xs font-bold shadow-sm"
                           name="intent"
                           value="addEntry"
                           type="submit"
                        >
                           {addingUpdate ? (
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin text-zinc-400 dark:text-zinc-300"
                              />
                           ) : (
                              <Icon
                                 name="plus"
                                 className="text-zinc-400 dark:text-zinc-300"
                                 size={14}
                              />
                           )}
                           <span className="text-1 pr-0.5">Add</span>
                        </button>
                     </fetcher.Form>
                  </div>
               )}
            </AdminOrStaffOrOwner>
            {/* <section className="flex items-center justify-between text-sm pb-1.5 pt-2 px-0.5">
               <div>Filter</div>
               <div>Sort</div>
            </section> */}
            {entries.docs?.length > 0 ? (
               <div className="border-color-sub divide-color-sub shadow-sm shadow-1 divide-y overflow-hidden rounded-lg border">
                  {entries.docs?.map((entry: Entry, int: number) => (
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
                              <Icon
                                 name="component"
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
            ) : null}
         </section>
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
                        <Icon
                           name="chevron-left"
                           size={18}
                           className="text-zinc-500"
                        >
                           Prev
                        </Icon>
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
                        <Icon
                           name="chevron-right"
                           title="Next"
                           size={18}
                           className="text-zinc-500"
                        />
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
         "addSection",
         "collectionUpdateIcon",
         "collectionDeleteIcon",
         "updateSection",
         "updateSectionOrder",
         "updateCollectionName",
      ]),
   });

   switch (intent) {
      case "addEntry": {
         assertIsPost(request);
         const { name, collectionId, siteId } = await zx.parseForm(
            request,
            EntrySchema,
         );
         try {
            const entryId = nanoid(12);

            return await payload.create({
               collection: "entries",
               data: {
                  name,
                  id: entryId,
                  author: user?.id as any,
                  collectionEntity: collectionId as any,
                  site: siteId as any,
                  slug: entryId as any,
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
      case "addSection": {
         try {
            assertIsPost(request);

            const { collectionId, sectionId, name, showTitle, type, showAd } =
               await zx.parseForm(request, SectionSchema);

            const collectionData = await payload.findByID({
               collection: "collections",
               id: collectionId,
               overrideAccess: false,
               user,
            });

            return await payload.update({
               collection: "collections",
               id: collectionData.id,
               data: {
                  sections: [
                     {
                        id: sectionId,
                        name,
                        showTitle,
                        showAd,
                        subSections: [
                           {
                              id: sectionId,
                              name,
                              type,
                           },
                        ],
                     },
                     //@ts-ignore
                     ...collectionData?.sections,
                  ],
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to update section order.",
            });
         }
      }
      case "updateSection": {
         assertIsPatch(request);
         const { collectionId, sectionId, showTitle, name } =
            await zx.parseForm(request, {
               collectionId: z.string(),
               sectionId: z.string(),
               name: z.string().optional(),
               showTitle: z.string().optional(),
            });
         try {
            const collectionData = await payload.findByID({
               collection: "collections",
               id: collectionId,
               overrideAccess: false,
               user,
            });

            const section = collectionData?.sections?.find(
               (section) => section.id === sectionId,
            );

            const updatedSection = {
               ...section,
               ...(name && { name }),
               ...(showTitle && { showTitle }),
            };

            const updatedSections =
               collectionData.sections?.map((item) =>
                  item.id === sectionId ? updatedSection : item,
               ) ?? [];

            return await payload.update({
               collection: "collections",
               id: collectionData.id,
               data: {
                  //@ts-ignore
                  sections: updatedSections,
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to update section order.",
            });
         }
      }
      case "updateSectionOrder": {
         assertIsPatch(request);
         const { overId, activeId, collectionId } = await zx.parseForm(
            request,
            {
               collectionId: z.string(),
               activeId: z.string(),
               overId: z.string(),
            },
         );
         try {
            const collectionData = await payload.findByID({
               collection: "collections",
               id: collectionId,
               overrideAccess: false,
               user,
            });

            const oldIndex = collectionData?.sections?.findIndex(
               (x) => x.id == activeId,
            );

            const newIndex = collectionData?.sections?.findIndex(
               (x) => x.id == overId,
            );

            const sortedArray = arrayMove(
               //@ts-ignore
               collectionData?.sections,
               oldIndex,
               newIndex,
            );
            return await payload.update({
               collection: "collections",
               id: collectionData.id,
               data: {
                  sections: sortedArray,
               },
               user,
               overrideAccess: false,
            });
         } catch (error) {
            return json({
               error: "Something went wrong...unable to update section order.",
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
            const { image, entityId, siteId } = result.data;
            try {
               const upload = await uploadImage({
                  payload,
                  image: image,
                  user,
                  siteId,
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
      case "updateCollectionName": {
         const { name, collectionId } = await zx.parseForm(request, {
            name: z.string().min(3),
            collectionId: z.string(),
         });
         try {
            await payload.update({
               collection: "collections",
               id: collectionId,
               data: {
                  name,
               },
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess(null, "Collection name updated");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update collection name",
            );
         }
      }
   }
};
