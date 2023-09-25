import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LightCone } from "payload/generated-custom-types";
import { AdditionalData } from "~/_custom/components/lightCones/AdditionalData";
import { Description } from "~/_custom/components/lightCones/Description";
import { Effect } from "~/_custom/components/lightCones/Effect";
import { ImageGallery } from "~/_custom/components/lightCones/ImageGallery";
import { PromotionCost } from "~/_custom/components/lightCones/PromotionCost";
import { Stats } from "~/_custom/components/lightCones/Stats";
import {
   EntryParent,
   EntryHeader,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderFunctionArgs) {
   const entryDefault = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as LightCone;

   //Feel free to query for more data here

   // ======================
   // Pull Additional data
   // ======================
   // const url = new URL(request.url).pathname;
   // const cid = url.split("/")[4];

   // const relic = await payload.find({
   //    // @ts-ignore
   //    collection: `lightCone-lKJ16E5IhH`,
   //    where: {
   //       relicset_id: {
   //          equals: "relicSet-" + cid,
   //       },
   //    },
   //    depth: 4,
   //    limit: 50,
   // });

   // const relicData = relic.docs;

   // ======================
   // ======================

   return json({ entryDefault });
}

export default function LightConeEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   // const { relicData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Stats pageData={entryDefault} />

            {/* Effects for Light Cone */}
            <Effect pageData={entryDefault} />

            {/* Promotion Cost for Weapon */}
            <PromotionCost pageData={entryDefault} />

            {/* Description and Flavor Text */}
            <Description pageData={entryDefault} />

            {/* Additional Data */}
            <AdditionalData pageData={entryDefault} />

            {/* Image Gallery */}
            <ImageGallery pageData={entryDefault} />
         </EntryContent>
      </EntryParent>
   );
}
