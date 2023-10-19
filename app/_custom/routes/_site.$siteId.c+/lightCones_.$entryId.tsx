import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LightCone } from "payload/generated-custom-types";
import { AdditionalData } from "~/_custom/components/lightCones/AdditionalData";
import { Description } from "~/_custom/components/lightCones/Description";
import { Effect } from "~/_custom/components/lightCones/Effect";
import { ImageGallery } from "~/_custom/components/lightCones/ImageGallery";
import { PromotionCost } from "~/_custom/components/lightCones/PromotionCost";
import { Stats } from "~/_custom/components/lightCones/Stats";
import { Entry } from "~/routes/_site+/$siteId.c_+/src/components";
import {
   getAllEntryData,
   getCustomEntryData,
   customEntryMeta,
} from "~/routes/_site+/$siteId.c_+/src/functions";

export { customEntryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await getAllEntryData({
      payload,
      params,
      request,
      user,
   });
   const entryDefault = (await getCustomEntryData({
      payload,
      params,
      request,
      depth: 3,
      entryId: entry.id,
   })) as LightCone;

   return json({ entryDefault, entry });
}

export default function LightConeEntry() {
   const { entryDefault } = useLoaderData<typeof loader>();
   // const { relicData } = useLoaderData<typeof loader>();

   return (
      <Entry>
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
      </Entry>
   );
}
