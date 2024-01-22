import { AdPlaceholder, AdUnit } from "~/routes/_site+/_components/Ramp";

import type { InlineAdElement } from "../core/types";

export function BlockInlineAd({ element }: { element: InlineAdElement }) {
   return (
      <AdPlaceholder>
         <AdUnit
            enableAds
            adType="desktopLeaderBTF"
            selectorId={`desktop-${element.id}`}
            className="flex items-center justify-center [&>div]:py-5"
         />
         {/* <AdUnit
               enableAds
               adType="mobileSquareBTF"
               selectorId={`mobile-${element.id}`}
               className="flex items-center justify-center [&>div]:py-5"
            /> */}
      </AdPlaceholder>
   );
}
