import { useLoaderData } from "@remix-run/react";
import { json, type LoaderArgs } from "@remix-run/node";
import {
   EntryParent,
   EntryHeader,
   getDefaultEntryData,
   meta,
   EntryContent,
   getCustomEntryData,
} from "~/modules/collections";
import type { LightCones } from "payload/generated-types";

import { Stats } from "~/_custom/components/lightCones/Stats";
import { Effect } from "~/_custom/components/lightCones/Effect";
import { Description } from "~/_custom/components/lightCones/Description";
import { PromotionCost } from "~/_custom/components/lightCones/PromotionCost";
import { ImageGallery } from "~/_custom/components/lightCones/ImageGallery";
import { AdditionalData } from "~/_custom/components/lightCones/AdditionalData";

export { meta };

export async function loader({
   context: { payload },
   params,
   request,
}: LoaderArgs) {
   const entryDefault = await getDefaultEntryData({ payload, params, request });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as LightCones;

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

   return json({ entryDefault, defaultData });
}

export default function LightConeEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   const { defaultData } = useLoaderData<typeof loader>();
   // const { relicData } = useLoaderData<typeof loader>();

   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Stats pageData={defaultData} />
            
            {/* Effects for Light Cone */}
            <Effect pageData={defaultData} />

            {/* Promotion Cost for Weapon */}
            <PromotionCost pageData={defaultData} />

            {/* Description and Flavor Text */}
            <Description pageData={defaultData} />

            {/* Additional Data */}
            <AdditionalData pageData={defaultData} />

            {/* Image Gallery */}
            <ImageGallery pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}
