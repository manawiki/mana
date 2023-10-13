import { redirect } from "@remix-run/node";
import type { Params, MetaFunction } from "@remix-run/react";
import { request as gqlRequest, gql } from "graphql-request";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/database/types";
import { select } from "payload-query";
import { singular } from "pluralize";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Entry, User } from "payload/generated-types";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { toWords } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

export type EntryType = {
   siteId: string;
   id: string;
   name?: string;
   icon?: {
      url?: string;
   };
};

export type EntryAllData = EntryType & {
   embeddedContent: JSON;
};

//Used for custom entry pages
export const meta: MetaFunction = ({
   matches,
   data,
}: {
   matches: any;
   data: any;
}) => {
   const siteName = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site?.name;
   return [
      {
         title: `${data?.entry.name} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
export async function getEmbeddedContent({
   user,
   payload,
   params,
   request,
}: {
   user: any;
   payload: Payload;
   params: Params;
   request: any;
}) {
   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   const { docs } = await payload.find({
      collection: "contentEmbeds",
      where: {
         "site.slug": {
            equals: siteId,
         },
         "collectionEntity.slug": {
            equals: collectionId,
         },
         relationId: {
            equals: entryId,
         },
      },
      depth: 1,
      overrideAccess: false,
      user,
   });

   if (user) {
      const hasAccess = isSiteOwnerOrAdmin(user?.id, docs[0]?.site);

      if (hasAccess) {
         const result = await Promise.all(
            docs.map(async (item) => {
               //Pull Embed drafts to compare if an update is needed
               const draftEmbed = await payload.findByID({
                  collection: "contentEmbeds",
                  id: item.id,
                  depth: 0,
                  draft: true,
                  overrideAccess: false,
                  user,
               });

               const versionData = await payload.findVersions({
                  collection: "contentEmbeds",
                  depth: 0,
                  where: {
                     parent: {
                        equals: item.id,
                     },
                  },
                  limit: 20,
                  user,
               });
               const versions = versionData.docs
                  .filter((doc) => doc.version._status === "published")
                  .map((doc) => {
                     const versionRow = select(
                        { id: true, updatedAt: true },
                        doc,
                     );
                     const version = select(
                        {
                           id: false,
                           content: true,
                           _status: true,
                        },
                        doc.version,
                     );

                     //Combine final result
                     const result = {
                        ...versionRow,
                        version,
                     };

                     return result;
                  });

               const isChanged =
                  JSON.stringify(draftEmbed.content) !=
                  JSON.stringify(item.content);

               return {
                  id: item.id,
                  content: draftEmbed.content,
                  sectionId: item.sectionId,
                  isChanged,
                  versions,
               };
            }),
         );
         return result;
      }

      //If no access, return content field from original query
      return docs.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         sectionId: item.sectionId,
      }));
   }

   return docs.map((item) => ({
      id: item.id,
      content: item.content,
      sectionId: item.sectionId,
   }));
}
export async function getCustomEntryData({
   payload,
   params,
   request,
   depth = 2,
}: {
   payload: Payload;
   params: Params;
   request: any;
   depth: number;
}) {
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   return fetchWithCache(
      `https://${siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=${depth}`,
   );
}
export async function getEntryFields({
   payload,
   params,
   request,
   user,
}: {
   payload: Payload;
   params: Params;
   request: Request;
   user: User | undefined;
}) {
   const { siteId, entryId } = zx.parseParams(params, {
      siteId: z.string(),
      entryId: z.string(),
   });
   const url = new URL(request.url).pathname;

   const collectionId = url.split("/")[3];

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
      draft: true,
      user,
      overrideAccess: false,
   });

   const collection = collectionData.docs[0];

   //Check if customDatabase is selected
   if (collection?.customDatabase) {
      const formattedName = singular(toWords(collection?.slug, true));

      //Document request if slug does exist
      const entryQuerySlug = gql`
               query ($entryId: String!) {
                  entrySlugData: ${formattedName}(
                        where: {
                           slug: { equals: $entryId }
                        }
                     ) {
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

      //Document request for id
      const entryQueryId = gql`
            query ($entryId: String!) {
               entryIdData: ${formattedName}(id: $entryId) {
                  id
                  name
                  icon {
                     url
                  }
               }
            }
         `;

      const endpoint = `https://${collection.site.slug}-db.${
         collection.site?.domain ?? "mana.wiki"
      }/api/graphql`;

      //Fetch to see if slug exists
      try {
         const { entrySlugData }: { entrySlugData: PaginatedDocs<Entry> } =
            await gqlRequest(endpoint, entryQuerySlug, {
               entryId,
            });

         const entrySlugDataResult = entrySlugData?.docs[0];

         //If anon and data exists, return entry data now
         if (entrySlugDataResult) {
            const result = {
               ...entrySlugDataResult,
               siteId: collection?.site?.id,
            };
            return { entry: result };
         }
      } catch {
         //Slug is undefined, attempt to fetch with ID
         const { entryIdData }: { entryIdData: EntryType } = await gqlRequest(
            endpoint,
            entryQueryId,
            {
               entryId,
            },
         );

         if (!entryIdData) throw redirect("/404", 404);

         const result = {
            ...entryIdData,
            siteId: collection?.site?.id,
         };
         return { entry: result };
      }
   }

   //This is a core site, so we use the local api
   //Fetch to see if slug exists
   const coreEntryData = await payload.find({
      collection: "entries",
      where: {
         "site.slug": {
            equals: siteId,
         },
         "collectionEntity.slug": {
            equals: collectionId,
         },
         slug: {
            equals: entryId,
         },
      },
      user,
      overrideAccess: false,
   });

   const entryData = coreEntryData.docs[0];

   //Slug exists, return entry
   if (entryData) {
      return {
         entry: {
            id: entryData?.id,
            name: entryData?.name,
            icon: { url: entryData?.icon?.url },
            siteId: collection?.site.id,
         },
      };
   }
   //Slug is undefined, attempt to fetch with ID
   const coreEntryById = await payload.findByID({
      collection: "entries",
      id: entryId,
   });

   if (!coreEntryById) throw redirect("/404", 404);

   return {
      entry: {
         id: coreEntryById?.id,
         name: coreEntryById?.name,
         icon: { url: coreEntryById?.icon?.url },
         siteId: collection?.site.id,
      },
   };
}
export async function getAllEntryData({
   payload,
   params,
   request,
   user,
}: {
   payload: Payload;
   params: Params;
   request: Request;
   user: User | undefined;
}) {
   const [{ entry }, embeddedContent] = await Promise.all([
      getEntryFields({
         payload,
         params,
         request,
         user,
      }),
      getEmbeddedContent({
         payload,
         params,
         request,
         user,
      }),
   ]);
   return {
      entry: {
         id: entry.id,
         siteId: entry.siteId,
         name: entry.name,
         icon: entry.icon,
         embeddedContent,
      },
   };
}
