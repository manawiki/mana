import type { Params } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import type { Payload } from "payload";

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
      return entry;
   }

   const entry = await payload.findByID({
      collection: "entries",
      id: entryId,
   });
   return entry;
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
   const siteName = matches.find(({ id }) => id === "routes/$siteId")?.data
      ?.site.name;
   return [
      {
         title: `${data.entryDefault.name} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
