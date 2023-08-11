import type { V2_MetaFunction } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import type { Payload } from "payload";
import type { PaginatedDocs } from "payload/dist/mongoose/types";
import { z } from "zod";
import { zx } from "zodix";

import { settings } from "mana-config";
import type { ContentEmbed } from "payload/generated-types";
import { isSiteOwnerOrAdmin } from "~/access/site";
import { cacheThis, fetchWithCache } from "~/utils/cache.server";

type HeaderType = {
   name?: string;
   icon?: {
      url?: string;
   };
};
export const getDefaultEntryData = async ({
   payload,
   params,
   request,
}: {
   payload: Payload;
   params: Params;
   request: any;
}) => {
   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   //We must get param from url since we can't access the param for custom templates.
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   const collectionData = await cacheThis(() =>
      payload.find({
         collection: "collections",
         where: {
            slug: {
               equals: collectionId,
            },
         },
      })
   );

   const collection = collectionData?.docs[0];

   let data = {} as HeaderType;
   if (collection.customEntryTemplate) {
      const entry = await fetchWithCache(
         `https://${siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=1`
      );
      data = { name: entry?.name, icon: { url: entry?.icon?.url } };
      return data;
   }
   const entry = await cacheThis(() =>
      payload.findByID({
         collection: "entries",
         id: entryId,
      })
   );
   data = { name: entry.name, icon: { url: entry?.icon?.url } };

   return data;
};

export const getEmbeddedContent = async ({
   user,
   payload,
   params,
   request,
   collection,
}: {
   user: any;
   payload: Payload;
   params: Params;
   request: any;
   collection: string;
}) => {
   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   //Pull published version first if exists
   const contentEmbedUrl = `${settings.domainFull}/api/contentEmbeds?where[site.slug][equals]=${siteId}&where[collectionEntity.slug][equals]=${collection}&where[relationId][equals]=${entryId}&depth=1`;
   const { docs: data } = (await fetchWithCache(contentEmbedUrl, {
      headers: {
         cookie: request.headers.get("cookie") ?? "",
      },
   })) as PaginatedDocs<ContentEmbed>;
   if (data.length == 0) return null;

   //If editing, we check perms then use local api to pull
   const content = data[0];

   const site = content?.site;
   const userId = user?.id;
   const hasAccess = isSiteOwnerOrAdmin(userId, site);

   let embedContent = [] as { content?: any; sectionId?: string }[];

   if (hasAccess) {
      // We use local API to bypass read perms since
      // (perms don't work if not findbyId since ID is not passed down) it's safe to query the data now
      const { docs: data } = await payload.find({
         collection: "contentEmbeds",
         where: {
            "site.slug": {
               equals: siteId,
            },
            "collectionEntity.slug": {
               equals: collection,
            },
            relationId: {
               equals: entryId,
            },
         },
         draft: true,
         depth: 1,
      });
      if (data.length == 0) return null;
      embedContent = data.map((item) => ({
         content: item.content,
         sectionId: item.sectionId,
      }));
      return embedContent;
   }

   embedContent = data.map((item) => ({
      content: item.content,
      sectionId: item.sectionId,
   }));

   return embedContent;
};

export const getCustomEntryData = async ({
   payload,
   params,
   request,
   depth = 2,
}: {
   payload: Payload;
   params: Params;
   request: any;
   depth: number;
}) => {
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   return fetchWithCache(
      `https://${siteId}-db.${settings.domain}/api/${collectionId}/${entryId}?depth=${depth}`
   );
};

export const meta: V2_MetaFunction = ({ matches, data }) => {
   const siteName = matches.find(
      ({ id }) => id === "routes/_site+/$siteId+/_layout"
   )?.data?.site?.name;
   return [
      {
         title: `${data?.entryDefault?.name} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
