import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { MetaFunction, Params } from "@remix-run/react";
import { request as gqlRequest, gql } from "graphql-request";
import type { Payload } from "payload";
import { select } from "payload-query";
import { singular } from "pluralize";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { User } from "payload/generated-types";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { AdminOrStaffOrOwner } from "~/modules/auth";
import { toWords } from "~/utils";
import { fetchWithCache } from "~/utils/cache.server";

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

   return json({ entryId, siteId, collectionId });
}

export default function CollectionEntryWiki() {
   return (
      <div className="mx-auto max-w-[728px] pb-3 max-tablet:px-3 laptop:pb-12">
         <AdminOrStaffOrOwner>
            <div className=""></div>
         </AdminOrStaffOrOwner>
      </div>
   );
}

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

   // Get custom entry data
   if (collection?.customDatabase) {
      const formattedName = singular(toWords(collection?.slug, true));
      const document = gql`
         query ($entryId: String!) {
            entry: ${formattedName}(id: $entryId) {
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

      const { entry }: { entry: EntryType } = await gqlRequest(
         endpoint,
         document,
         {
            entryId,
         },
      );
      const result = {
         ...entry,
         siteId: collection?.site?.id,
      };

      return { entry: result };
   }

   const coreEntryData = await payload.find({
      collection: "entries",
      where: {
         "site.slug": {
            equals: siteId,
         },
         slug: {
            equals: entryId,
         },
      },
      user,
      overrideAccess: false,
   });

   const entryData = coreEntryData.docs[0];

   const entry = {
      id: entryData?.id,
      name: entryData?.name,
      icon: { url: entryData?.icon?.url },
      siteId: collection?.site.id,
   };

   if (!user) {
      //If anon and data exists, return entry data now. This means a slug exists.
      //Attempt to fetch with ID, this means that the entry doesn't have a slug.
      if (!entryData) {
         const entryById = await payload.findByID({
            collection: "entries",
            id: entryId,
         });

         if (!entryById) throw redirect("/404", 404);
         return {
            entry: {
               id: entryById?.id,
               name: entryById?.name,
               icon: { url: entryById?.icon?.url },
               siteId: collection?.site.id,
            },
         };
      }
      return { entry };
   }

   invariant(user, "Not logged in");

   //If entry is not falsy, then we know the page was accessed with a canonical, as a site admin, we want to use the path with ID instead
   if (entryData) {
      throw redirect(
         `/${entryData?.site?.slug}/c/${entryData.collectionEntity?.slug}/${entryData.id}`,
      );
   }
   return { entry };
}

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
