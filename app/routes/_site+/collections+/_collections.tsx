import { useState } from "react";

import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { nanoid } from "nanoid";
import {
   jsonWithError,
   jsonWithSuccess,
   redirectWithSuccess,
} from "remix-toast";
import { z } from "zod";
import { zx } from "zodix";

import {
   getMultipleFormData,
   uploadImage,
} from "~/utils/upload-handler.server";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

import { AddCollection } from "./components/AddCollection";
import { CollectionCommandBar } from "./components/CollectionCommandBar";
import { CollectionList } from "./components/CollectionList";
import {
   CollectionSchema,
   CollectionUpdateSchema,
} from "../c_+/$collectionId_.$entryId/utils/CollectionSchema";

export default function CollectionIndex() {
   const { site } = useSiteLoaderData();
   const [isChanged, setIsChanged] = useState(false);

   const [dndCollections, setDnDCollections] = useState(site.collections);

   return (
      <>
         <main className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:w-[728px] pt-20 laptop:pt-6">
            <div className="relative flex items-center pb-3">
               <h1 className="font-header text-2xl laptop:text-3xl font-bold pr-3">
                  Collections
               </h1>
               <span className="dark:bg-zinc-700 bg-zinc-100 rounded-l-full flex-grow h-0.5" />
            </div>
            <AddCollection site={site} setDnDCollections={setDnDCollections} />
            <CollectionList
               setDnDCollections={setDnDCollections}
               dndCollections={dndCollections}
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
      intent: z.enum([
         "deleteCollection",
         "updateCollection",
         "updateCollectionOrder",
         "addCollection",
      ]),
   });

   switch (intent) {
      case "deleteCollection": {
         try {
            const { collectionId } = await zx.parseForm(request, {
               collectionId: z.string(),
            });

            const entriesExist = await payload.find({
               collection: "entries",
               where: {
                  collectionEntity: {
                     equals: collectionId,
                  },
               },
               overrideAccess: false,
               user,
               depth: 0,
            });
            if (entriesExist.totalDocs != 0) {
               return jsonWithError(
                  null,
                  `${entriesExist.totalDocs} entries must be deleted before deleting this collection`,
               );
            }
            await payload.delete({
               collection: "collections",
               id: collectionId,
               user,
               overrideAccess: false,
               depth: 1,
            });
            return redirectWithSuccess("/collections", "Collection deleted");
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to delete collection",
            );
         }
      }
      case "updateCollectionOrder": {
         const { collections, siteId } = await zx.parseForm(request, {
            siteId: z.string(),
            collections: z.string(),
         });

         await payload.update({
            collection: "sites",
            id: siteId,
            data: {
               collections: JSON.parse(collections),
            },
            depth: 0,
            user,
            overrideAccess: false,
         });
         return jsonWithSuccess(null, "Collection order updated");
      }
      case "updateCollection": {
         try {
            const result = await getMultipleFormData({
               request,
               prefix: "collection-icon",
               schema: CollectionUpdateSchema,
            });
            if (result.success) {
               const {
                  collectionId,
                  collectionIcon,
                  collectionIconId,
                  siteId,
                  ...data
               } = result.data;

               //Upload new collection icon
               if (collectionIcon && !collectionIconId) {
                  const upload = await uploadImage({
                     payload,
                     image: collectionIcon,
                     user,
                     siteId,
                  });

                  await payload.update({
                     collection: "collections",
                     id: collectionId,
                     data: {
                        icon: upload?.id as any,
                     },
                     overrideAccess: false,
                     user,
                  });
               }
               //If existing icon, delete it and upload new one
               if (collectionIcon && collectionIconId) {
                  await payload.delete({
                     collection: "images",
                     id: collectionIconId,
                     overrideAccess: false,
                     user,
                  });
                  const upload = await uploadImage({
                     payload,
                     image: collectionIcon,
                     user,
                     siteId,
                  });

                  await payload.update({
                     collection: "collections",
                     id: collectionId,
                     data: {
                        icon: upload?.id as any,
                     },
                     overrideAccess: false,
                     user,
                  });
               }
               const updateCollection = await payload.update({
                  collection: "collections",
                  id: collectionId,
                  data: {
                     ...data,
                  },
                  user,
                  overrideAccess: false,
               });
               if (updateCollection)
                  return jsonWithSuccess(
                     null,
                     `${updateCollection?.name} settings updated`,
                  );
               return jsonWithError(
                  null,
                  "Something went wrong, unable to update collection...",
               );
            }
         } catch (error) {
            return jsonWithError(
               null,
               "Something went wrong...unable to update collection",
            );
         }
      }
      case "addCollection": {
         try {
            const {
               name,
               slug,
               hiddenCollection,
               customListTemplate,
               customEntryTemplate,
               customDatabase,
               siteId,
            } = await zx.parseForm(request, CollectionSchema);

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
               user,
               overrideAccess: false,
            });
            return jsonWithSuccess(null, "Collection added");
         } catch (error) {
            payload.logger.error(`${error}`);
         }
      }
   }
};

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
