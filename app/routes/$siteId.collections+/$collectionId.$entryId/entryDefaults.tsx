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
   const { entryId } = zx.parseParams(params, {
      entryId: z.string(),
   });
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
}: {
   payload: Payload;
   params: Params;
   request: any; //TODO: fix this type
}) => {
   const url = new URL(request.url).pathname;
   const parts = url.split("/");
   const slug = parts[3];

   const { entryId, siteId } = zx.parseParams(params, {
      entryId: z.string(),
      siteId: z.string(),
   });

   const entry = await payload.findByID({
      collection: `${slug}-${siteId}`,
      id: `${slug}-${entryId}`,
   });

   return entry;
};

export const meta: V2_MetaFunction = ({ parentsData, data }) => {
   const siteName = parentsData["routes/$siteId"].site.name;

   return [
      {
         title: `${data.entryDefault.name} - ${siteName}`,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};
