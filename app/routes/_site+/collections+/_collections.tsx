import { useState } from "react";

import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { nanoid } from "nanoid";
import { jsonWithError, jsonWithSuccess } from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import { assertIsPost } from "~/utils/http.server";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddCollection } from "./components/AddCollection";
import { CollectionCommandBar } from "./components/CollectionCommandBar";
import { CollectionList } from "./components/CollectionList";
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
   const [isChanged, setIsChanged] = useState(false);

   const collectionIds = site.collections?.map((item) => item.id) ?? [];

   const [dndCollections, setDnDCollections] = useState(collectionIds);

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
            <CollectionList
               setDnDCollections={setDnDCollections}
               dndCollections={dndCollections}
               site={site}
               isChanged={isChanged}
               setIsChanged={setIsChanged}
            />
            <CollectionCommandBar
               setIsChanged={setIsChanged}
               dndCollections={dndCollections}
               setDnDCollections={setDnDCollections}
               isChanged={isChanged}
               site={site}
            />
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
      case "updateCollection": {
         const { collections, siteId } = await zx.parseForm(request, {
            siteId: z.string(),
            collections: z.string(),
         });
         const collectionArrayToSave = collections.split(",");

         await payload.update({
            collection: "sites",
            id: siteId,
            data: {
               //@ts-ignore
               collections: collectionArrayToSave,
            },
            depth: 0,
            user,
            overrideAccess: false,
         });
         return jsonWithSuccess(null, "Collection order updated successfully");
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
      }
   }
};
