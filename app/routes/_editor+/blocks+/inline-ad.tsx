import { AdPlaceholder, AdUnit } from "~/routes/_site+/_components/RampUnit";

import type { InlineAdElement } from "../core/types";

export function BlockInlineAd({ element }: { element: InlineAdElement }) {
   return (
      <AdPlaceholder>
         <AdUnit
            className="mt-4"
            enableAds
            adType="leaderboard_btf"
            selectorId={`desktop-${element.id}`}
         />
         {/* <AdUnit
               enableAds
               adType="mobileSquareBTF"
               selectorId={`mobile-${element.id}`}
               className="flex items-center justify-center"
            /> */}
      </AdPlaceholder>
   );
}
