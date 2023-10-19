import { redirect } from "@remix-run/node";
import type { Params, MetaFunction } from "@remix-run/react";
import { request as gqlRequest, gql } from "graphql-request";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/database/types";
import { select } from "payload-query";
import { plural } from "pluralize";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { Entry, User } from "payload/generated-types";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { gqlEndpoint, toWords } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

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

export const customListMeta: MetaFunction = ({ matches }: { matches: any }) => {
   const site = matches.find(
      ({ id }: { id: string }) => id === "routes/_site+/$siteId+/_layout",
   )?.data?.site;

   const collectionId = matches[2].pathname.split("/")[3];

   const collection = site?.collections?.find(
      (collection: any) => collection.slug === collectionId,
   );
   return [
      {
         title: `${collection?.name} | ${site?.name}`,
      },
   ];
};

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
            equals: id,
         },
      },
      depth: 1,
      overrideAccess: false,
      user,
   });
   if (!docs) return;

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
      const formattedNamePlural = plural(toWords(collection?.slug, true));

      const entryQuery = gql`
      query ($entryId: String!) {
         entryData: ${formattedNamePlural}(
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
         domain: collection.site?.domain,
      });

      const { entryData }: { entryData: PaginatedDocs<Entry> } =
         await gqlRequest(endpoint, entryQuery, {
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
            collectionId: collection.slug,
            siteId: collection?.site?.id,
            siteSlug: collection?.site?.slug,
            sections: collection?.sections,
         },
      };
   }
   //This is a core site, so we use the local api
   const coreEntryData = await payload.find({
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
   });

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
         collectionId: collection?.slug,
         sections: collection?.sections,
         siteId: collection?.site.id,
         siteSlug: collection?.site?.slug,
      },
   };
}

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

//Fetches all entry data. Includes

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
      entry.collectionId
   }/${entry.id}?depth=${rest?.depth ?? 2}`;

   const GQLorREST = gql?.query
      ? gqlRequest(gqlPath, gql?.query, {
           entryId: entry.id,
           ...gql?.variables,
        })
      : rest?.depth
      ? fetchWithCache(restPath)
      : undefined;

   const [data, embeddedContent] = await Promise.all([
      await GQLorREST,
      await getEmbeddedContent({
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

interface ListFetchType {
   params: Params;
   gql?: {
      query: string;
      variables?: {};
   };
}

export async function fetchList({ params, gql }: ListFetchType) {
   const gqlPath = gqlEndpoint({
      siteSlug: params.siteId,
   });

   const data = gql?.query
      ? await gqlRequest(gqlPath, gql?.query, {
           ...gql?.variables,
        })
      : undefined;

   return {
      list: {
         data,
      },
   };
}
