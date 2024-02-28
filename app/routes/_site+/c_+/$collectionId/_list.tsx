import { useEffect } from "react";

import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
   Link,
   useLoaderData,
   useSearchParams,
   useFetcher,
   useParams,
} from "@remix-run/react";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { zx } from "zodix";

import type { Entry } from "payload/generated-types";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Input } from "~/components/Input";
import { AdminOrStaffOrOwner } from "~/routes/_auth+/components/AdminOrStaffOrOwner";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { isAdding } from "~/utils/form";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { fetchListCore } from "./utils/fetchListCore.server";
import { listMeta } from "./utils/listMeta";
import { EntrySchema } from "../../collections+/sections";
import { List } from "../_components/List";

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

   const { site } = useSiteLoaderData();

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
               <div className="mb-3 flex items-center gap-4 w-full">
                  {collection?.customDatabase ? (
                     <div className="flex items-center justify-end w-full">
                        <Button
                           type="button"
                           color="blue"
                           target="_blank"
                           className="text-sm"
                           href={`https://${site.slug}-db.${
                              site?.domain ? site.domain : "mana.wiki"
                           }/admin/collections/${collection?.slug}/create`}
                        >
                           {addingUpdate ? (
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin "
                              />
                           ) : (
                              <Icon
                                 className="text-blue-200"
                                 name="plus"
                                 size={15}
                              />
                           )}
                           Add {collection?.name}
                        </Button>
                     </div>
                  ) : (
                     <fetcher.Form
                        ref={zoEntry.ref}
                        method="post"
                        action="/collections/entry"
                        className="flex items-center justify-between gap-4 flex-grow"
                     >
                        <Input
                           required
                           placeholder="Type an entry name..."
                           name={zoEntry.fields.name()}
                           type="text"
                           className="w-full focus:outline-none !bg-transparent text-sm focus:border-0 focus:ring-0 border-0"
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
                        <Button
                           className="h-11 tablet:h-9 w-24"
                           name="intent"
                           value="addEntry"
                           type="submit"
                           color="blue"
                        >
                           {addingUpdate ? (
                              <Icon
                                 name="loader-2"
                                 size={14}
                                 className="animate-spin "
                              />
                           ) : (
                              <Icon
                                 className="text-blue-200"
                                 name="plus"
                                 size={14}
                              />
                           )}
                           Add
                        </Button>
                     </fetcher.Form>
                  )}
               </div>
            </AdminOrStaffOrOwner>

            {entries.docs?.length > 0 ? (
               <div className="border-color-sub divide-color-sub divide-y overflow-hidden shadow shadow-zinc-100 dark:shadow-zinc-800/80 rounded-xl border">
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
            ) : (
               <div className="text-sm text-1 border-t text-center border-color py-3 mt-4">
                  No entries exist...
               </div>
            )}
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
