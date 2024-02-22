import { json } from "@remix-run/node";
import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { nanoid } from "nanoid";
import { jsonWithError } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { assertIsPost } from "~/utils/http.server";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddCollection } from "./components/AddCollection";
import { CollectionSchema } from "../c_+/$collectionId_.$entryId/utils/CollectionSchema";

export const meta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/_layout",
   );
   const siteName = site?.data?.site.name;
   return [
      {
         title: `Collections - ${siteName}`,
      },
   ];
};

export default function CollectionIndex() {
   const { site } = useSiteLoaderData();

   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
            <div className="relative flex items-center pb-3">
               <h1 className="font-header text-2xl laptop:text-3xl font-bold pr-3">
                  Collections
               </h1>
               <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
            </div>
            <AddCollection siteId={site.id} />
            {site?.collections?.length === 0 ? null : (
               <>
                  <div className="space-y-2.5 pb-5">
                     {site?.collections?.map((row, int) => (
                        <Link
                           key={row.slug}
                           prefetch="intent"
                           to={`/c/${row.slug}`}
                           className="relative flex items-center justify-between shadow-zinc-100 gap-2 dark:bg-dark350 dark:hover:border-zinc-600/70
                           p-2 border-color-sub shadow-sm dark:shadow-black/20 overflow-hidden rounded-2xl border hover:border-zinc-200 bg-zinc-50"
                        >
                           <div className="flex items-center gap-3">
                              <div className="border-color-sub border bg-3-sub justify-center shadow-sm shadow-1 flex h-8 w-8 flex-none items-center overflow-hidden rounded-full">
                                 {row.icon?.url ? (
                                    <Image
                                       width={50}
                                       height={50}
                                       alt={row.name ?? "List Icon"}
                                       options="aspect_ratio=1:1&height=80&width=80"
                                       url={row?.icon?.url}
                                    />
                                 ) : (
                                    <Icon
                                       name="database"
                                       className="text-1 mx-auto"
                                       size={14}
                                    />
                                 )}
                              </div>
                              <span className="truncate text-sm font-bold">
                                 {row.name}
                              </span>
                           </div>
                           <Icon
                              name="chevron-right"
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
   const { intent } = await zx.parseForm(request, {
      intent: z.enum(["deleteCollection", "updateCollection", "addCollection"]),
   });

   // Add Collection

   switch (intent) {
      case "deleteCollection": {
      }
      case "addCollection": {
         assertIsPost(request);
         const {
            name,
            slug,
            hiddenCollection,
            customListTemplate,
            customEntryTemplate,
            customDatabase,
            siteId,
         } = await zx.parseForm(request, CollectionSchema);
         try {
            //See if duplicate exists on the same site
            const existingSlug = await payload.find({
               collection: "collections",
               where: {
                  site: {
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
               return jsonWithError(
                  null,
                  "Collection with this slug already exists",
               );
            }
            const collection = await payload.create({
               collection: "collections",
               data: {
                  id: `${siteId}-${slug}`,
                  name,
                  slug,
                  site: siteId as any,
                  hiddenCollection,
                  customListTemplate,
                  customEntryTemplate,
                  customDatabase,
               },
               depth: 0,
               user,
               overrideAccess: false,
            });
            //Weird bug doesn't allow us to use a custom id, so we update with the custom id after creation
            await payload.update({
               collection: "collections",
               id: collection.id,
               data: {
                  sections: [
                     {
                        id: nanoid(),
                        slug: "main",
                        name: "Main",
                        subSections: [
                           {
                              id: nanoid(),
                              slug: "main",
                              name: "Main",
                              type: "editor",
                           },
                        ],
                     },
                  ],
               },
               depth: 0,
               user,
               overrideAccess: false,
            });
         } catch (error) {
            payload.logger.error(`${error}`);
         }

         // Last resort error message
         return json({
            error: "Something went wrong...unable to add collection.",
         });
      }
   }
};
