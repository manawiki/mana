import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useMatches } from "@remix-run/react";
import { request as gqlRequest, gql } from "graphql-request";
import { Component } from "lucide-react";
import type { Payload } from "payload";
import { select } from "payload-query";
import { singular } from "pluralize";
import { z } from "zod";
import { zx } from "zodix";

import { Image } from "~/components/Image";
import type { Site, User } from "~/db/payload-types";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { meta } from "~/modules/collections";
import { toWords } from "~/utils";

import { CollectionCrumbs } from "./$collectionId";

const EntrySchema = z.object({
   entryId: z.string(),
   siteId: z.string(),
   collectionId: z.string(),
});

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entryId, siteId, collectionId } = zx.parseParams(
      params,
      EntrySchema,
   );

   const { entry, collection } = await fetchEntry({
      collectionId,
      entryId,
      payload,
      siteId,
      user,
   });

   return json({ entry, collection, entryId, siteId, collectionId });
}

export { meta };

export default function CollectionEntryWiki() {
   const { entry, collection, entryId, siteId, collectionId } =
      useLoaderData<typeof loader>();
   const fetcher = useFetcher();

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   const thing = useMatches();
   console.log(thing);
   return (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:pb-12">
         <div className="flex items-center justify-between gap-2 pb-2">
            <h1 className="font-bold font-header text-2xl">{entry?.name}</h1>
            <div className="flex-none border border-color shadow-1 shadow-sm bg-white -mb-8 flex h-14 w-14 rounded-full overflow-hidden items-center">
               {entry?.icon ? (
                  <Image
                     url={entry.icon.url}
                     options="aspect_ratio=1:1&height=80&width=80"
                     alt="Collection Icon"
                  />
               ) : (
                  <Component className="text-1 mx-auto" size={18} />
               )}
            </div>
         </div>
         <CollectionCrumbs
            isEntry
            site={site}
            collection={collection}
            entry={entry}
         />
         {/* <EntryHeader entry={entryDefault} /> */}
         <AdminOrStaffOrOwner>
            <div className="">
               {/* <ManaEditor
                  siteId={siteId ?? ""}
                  fetcher={fetcher}
                  collectionEntity={collectionId ?? ""}
                  pageId={entryId ?? ""}
                  defaultValue={embed ?? initialValue}
               /> */}
            </div>
         </AdminOrStaffOrOwner>
      </div>
   );
}

type EntryType = {
   name?: string;
   icon?: {
      url?: string;
   };
};

async function fetchEntry({
   payload,
   siteId,
   collectionId,
   entryId,
   user,
}: typeof EntrySchema._type & {
   payload: Payload;
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
      const formattedName = singular(toWords(collectionId, true));
      const document = gql`
         query ($entryId: String!) {
            entry: ${formattedName}(id: $entryId) {
               name
               icon {
                  url
               }
            }
         }
      `;
      const endpoint = `https://${collectionEntry?.site.slug}-db.${
         collectionEntry?.site?.domain ?? "mana.wiki"
      }/api/graphql`;

      const { entry }: { entry: EntryType } = await gqlRequest(
         endpoint,
         document,
         {
            entryId,
         },
      );

      return { collection, entry };
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
