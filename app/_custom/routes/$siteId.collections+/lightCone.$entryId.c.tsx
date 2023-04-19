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
import type { RelicSetLKJ16E5IhH } from "payload/generated-types";
import { Image } from "~/components/Image";

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
   const entryDefault = await getDefaultEntryData({ payload, params });
   const defaultData = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
   })) as LightConeLKJ16E5IhH;

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

   console.log(defaultData);
   // console.log(entryDefault);
   return (
      <EntryParent>
         <EntryHeader entry={entryDefault} />
         <EntryContent>
            <Stats pageData={defaultData} />

            {/* Effects for Light Cone */}
            <h2>Effect</h2>
            <Effect pageData={defaultData} />

            {/* Promotion Cost for Weapon */}
            <h2>Promotion Cost</h2>
            <PromotionCost pageData={defaultData} />

            {/* Description and Flavor Text */}
            <h2>Description</h2>
            <Description pageData={defaultData} />

            {/* Additional Data */}
            <h2>Additional Data</h2>
            <AdditionalData pageData={defaultData} />

            {/* Image Gallery */}
            <h2>Images</h2>
            <ImageGallery pageData={defaultData} />
         </EntryContent>
      </EntryParent>
   );
}

const Header = () => {
   const { defaultData } = useLoaderData<typeof loader>();

   return (
      <>
         <div>{defaultData}</div>
      </>
   );
};

// ========================================
// Lol manually putting stat data in for now since not sure if Strapi ready to go
// --- Will be loaded properly from DB ---
// ========================================
// ========================================
// ========================================
