import { AdPlaceholder, AdUnit } from "~/routes/_site+/_components/RampUnit";

import type { InlineAdElement } from "../core/types";

export function BlockInlineAd({ element }: { element: InlineAdElement }) {
   return (
      <AdPlaceholder>
         <AdUnit
            className="my-8 mx-auto flex items-center justify-center"
            enableAds
            adType={{
               desktop: "leaderboard_btf",
               tablet: "leaderboard_btf",
               mobile: "med_rect_btf",
            }}
            selectorId={`inline-${element.id}`}
         />
      </AdPlaceholder>
   );
}
