import type { Params } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import type { Payload } from "payload";
import type { ContentEmbed, Site } from "~/db/payload-types";
import { isSiteOwnerOrAdmin } from "~/access/site";

export const getDefaultEntryData = async ({
   payload,
   params,
   request,
}: {
   payload: Payload;
   params: Params;
   request: any;
}) => {
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   //We must get param from url since we can't access the param for custom templates.
   const url = new URL(request.url).pathname;
   const collectionId = url.split("/")[3];

   const collectionData = await payload.find({
      collection: "collections",
      where: {
         slug: {
            equals: collectionId,
         },
      },
   });

   const collection = collectionData?.docs[0];

   if (collection.customEntryTemplate) {
      const entry = await (
         await fetch(
            `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/${collectionId}/${entryId}?depth=1`
         )
      ).json();
      const data = { name: entry.name, icon: { url: entry?.icon?.url } };
      return data;
   }
   const entry = await payload.findByID({
      collection: "entries",
      id: entryId,
   });
   const data = { name: entry.name, icon: { url: entry?.icon?.url } };

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
   const url = new URL(request.url).origin;

   //Pull published version first if exists
   const contentEmbedUrl = `${url}/api/contentEmbeds?where[site.slug][equals]=${siteId}&where[collectionEntity.slug][equals]=${collection}&where[relationId][equals]=${entryId}&depth=1`;
   const { docs: data } = await (
      await fetch(contentEmbedUrl, {
         headers: {
            cookie: request.headers.get("cookie") ?? "",
         },
      })
   ).json();
   if (data.length == 0) return null;

   //If editing, we check perms then use local api to pull
   const content = data[0];

   const site = content?.site;
   const userId = user?.id;
   const hasAccess = isSiteOwnerOrAdmin(userId, site);

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
      const embedContent = data.map((item: ContentEmbed) => ({
         content: item.content,
         sectionId: item.sectionId,
      }));
      return embedContent;
   }

   const embedContent = data.map((item: ContentEmbed) => ({
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

   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const entry = await (
      await fetch(
         `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/${collectionId}/${entryId}?depth=${depth}`
      )
   ).json();
   return entry;
};

export const meta: V2_MetaFunction = ({ matches, data }) => {
   const siteName = matches.find(({ id }) => id === "routes/$siteId+/_layout")
      ?.data?.site.name;
   return [
      {
         title: `${data.entryDefault.name} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
