import type { Params } from "@remix-run/react";
import type { V2_MetaFunction } from "@remix-run/node";
import { z } from "zod";
import { zx } from "zodix";
import type { Payload } from "payload";

export const getDefaultEntryData = async ({
   payload,
   params,
}: {
   payload: Payload;
   params: Params;
}) => {
   const { entryId, collectionId } = zx.parseParams(params, {
      entryId: z.string(),
      collectionId: z.string(),
   });
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
            `https://${process.env.PAYLOAD_PUBLIC_SITE_ID}-db.mana.wiki/api/${collectionId}/${entryId}`
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
   const slug = url.split("/")[3];

   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });

   const entry = await payload.findByID({
      // @ts-ignore
      collection: slug,
      id: entryId,
      depth: depth,
   });

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
