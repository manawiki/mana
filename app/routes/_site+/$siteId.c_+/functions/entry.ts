import { redirect } from "@remix-run/node";
import type { Params, MetaFunction } from "@remix-run/react";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/database/types";
import { select } from "payload-query";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Entry, User } from "payload/generated-types";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { gqlFormat, gqlEndpoint } from "~/utils";
import {
   fetchWithCache,
   gqlRequestWithCache,
   gql,
   cacheThis,
} from "~/utils/cache.server";

export type EntryType = {
   siteId: string;
   id: string;
   name?: string;
   slug?: string;
   icon?: {
      url?: string;
   };
};

export type EntryAllData = EntryType & {
   embeddedContent: JSON;
};

// https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist
type RequireOnlyOneOptional<T, Keys extends keyof T = keyof T> = Pick<
   T,
   Exclude<keyof T, Keys>
> &
   {
      [K in Keys]-?: Pick<T, K> & Partial<Record<Exclude<Keys, K>, undefined>>;
   }[Keys];

type RestOrGraphql = RequireOnlyOneOptional<EntryFetchType, "rest" | "gql">;

interface EntryFetchType {
   payload: Payload;
   params: Params;
   request: Request;
   user: User | undefined;
   rest?: {
      depth?: number;
   };
   gql?: {
      query: string;
      variables?: {};
   };
}

//Fetches all entry data.
export async function fetchEntry({
   payload,
   params,
   request,
   user,
   rest,
   gql,
}: RestOrGraphql) {
   const { entry } = await getEntryFields({
      payload,
      params,
      request,
      user,
   });

   const gqlPath = gqlEndpoint({
      siteSlug: entry.siteSlug,
   });

   const restPath = `https://${entry.siteSlug}-db.${settings.domain}/api/${
      entry.collectionSlug
   }/${entry.id}?depth=${rest?.depth ?? 2}`;

   const GQLorREST = gql?.query
      ? gqlRequestWithCache(gqlPath, gql?.query, {
           entryId: entry.id,
           ...gql?.variables,
        })
      : rest?.depth
      ? fetchWithCache(restPath)
      : undefined;

   const [data, embeddedContent] = await Promise.all([
      GQLorREST,
      getEmbeddedContent({
         id: entry.id as string,
         payload,
         params,
         request,
         user,
      }),
   ]);

   return {
      entry: {
         ...entry,
         embeddedContent,
         data,
      },
   };
}

export async function getEmbeddedContent({
   id,
   user,
   payload,
   params,
   request,
}: {
   id: string;
   user: any;
   payload: Payload;
   params: Params;
   request: any;
}) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string(),
   });

   //We can't use param since it won't exist on a custom site
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   if (user) {
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
               equals: id,
            },
         },
         depth: 1,
         overrideAccess: false,
         user,
      });

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
                     JSON.stringify(item.content) || versions.length == 0;

               return {
                  id: item.id,
                  content: draftEmbed.content,
                  subSectionId: item.subSectionId,
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
         subSectionId: item.subSectionId,
      }));
   }

   if (!user) {
      const { docs } = await cacheThis(
         () =>
            payload.find({
               collection: "contentEmbeds",
               where: {
                  "site.slug": {
                     equals: siteId,
                  },
                  "collectionEntity.slug": {
                     equals: collectionId,
                  },
                  relationId: {
                     equals: id,
                  },
               },
               depth: 1,
               overrideAccess: false,
               user,
            }),
         `contentEmbeds-${siteId}-${collectionId}-${id}`,
      );
      return docs.map((item) => ({
         isChanged: false,
         id: item.id,
         content: item.content,
         subSectionId: item.subSectionId,
      }));
   }
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

   const collectionData = await cacheThis(
      () =>
         payload.find({
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
         }),
      `collection-${siteId}-${collectionId}`,
   );

   const collection = collectionData.docs[0];

   //Check if customDatabase is selected
   if (collection?.customDatabase) {
      const label = gqlFormat(collection?.slug, "list");

      const entryQuery = gql`
      query ($entryId: String!) {
         entryData: ${label}(
               where: { OR: [{ slug: { equals: $entryId } }, { id: { equals: $entryId } }] }
            ) {
            docs {
               id
               slug
               name
               icon {
                  id
                  url
               }
            }
         }
      }
      `;

      const endpoint = gqlEndpoint({
         siteSlug: collection.site.slug,
      });

      const { entryData }: { entryData: PaginatedDocs<Entry> } =
         await gqlRequestWithCache(endpoint, entryQuery, {
            entryId,
         });

      const entry = entryData?.docs[0];

      //If there is a slug filled out, we should redirect (ex:redirects ID to slugs)
      if (entry?.slug && entry?.slug != entryId)
         throw redirect(
            `/${collection?.site?.slug}/c/${collection.slug}/${entry?.slug}`,
            301,
         );

      return {
         entry: {
            ...entry,
            collectionName: collection.name,
            collectionSlug: collection?.slug,
            collectionEntity: collection?.id,
            siteId: collection?.site?.id,
            siteSlug: collection?.site?.slug,
            sections: collection?.sections,
         },
      };
   }
   //This is a core site, so we use the local api
   const coreEntryData = await cacheThis(
      () =>
         payload.find({
            collection: "entries",
            where: {
               "site.slug": {
                  equals: siteId,
               },
               "collectionEntity.slug": {
                  equals: collectionId,
               },
               or: [
                  {
                     slug: {
                        equals: entryId,
                     },
                  },
                  {
                     id: {
                        equals: entryId,
                     },
                  },
               ],
            },
            user,
            overrideAccess: false,
         }),
      `entries-${siteId}-${collectionId}-${entryId}`,
   );

   const entryData = coreEntryData.docs[0];

   //If there is a slug filled out, we should redirect to the slug page instead as the canonical
   if (entryData?.slug && entryData?.slug != entryId)
      throw redirect(
         `/${collection?.site?.slug}/c/${collection?.slug}/${entryData?.slug}`,
         301,
      );

   return {
      entry: {
         id: entryData?.id,
         name: entryData?.name,
         icon: { id: entryData?.icon?.id, url: entryData?.icon?.url },
         collectionName: collection?.name,
         collectionSlug: collection?.slug,
         collectionEntity: collection?.id,
         sections: collection?.sections,
         siteId: collection?.site.id,
         siteSlug: collection?.site?.slug,
      },
   };
}

//Used for custom entry pages
export const customEntryMeta: MetaFunction = ({
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
         title: `${data?.entry.name} | ${data?.entry?.collectionName} - ${siteName}`,
      },
   ];
};
