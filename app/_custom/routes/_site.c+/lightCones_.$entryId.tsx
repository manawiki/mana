import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AdditionalData } from "~/_custom/components/lightCones/AdditionalData";
import { Description } from "~/_custom/components/lightCones/Description";
import { Effect } from "~/_custom/components/lightCones/Effect";
import { ImageGallery } from "~/_custom/components/lightCones/ImageGallery";
import { PromotionCost } from "~/_custom/components/lightCones/PromotionCost";
import { Stats } from "~/_custom/components/lightCones/Stats";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      rest: {
         depth: 3,
      },
   });

   return json({ entry });
}

const SECTIONS = {
   stats: Stats,
   effect: Effect,
   "promotion-cost": PromotionCost,
   description: Description,
   promotion: PromotionCost,
   "additional-data": AdditionalData,
   gallery: ImageGallery,
};

export default function LightConeEntry() {
   const { entry } = useLoaderData<typeof loader>();

   return <Entry customComponents={SECTIONS} customData={entry.data} />;
}
