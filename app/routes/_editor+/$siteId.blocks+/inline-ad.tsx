import { Icon } from "~/components/Icon";
import { AdUnit } from "~/routes/_site+/$siteId+/src/components";

import type { InlineAdElement } from "../core/types";

export function BlockInlineAd({
   element,
   readOnly,
}: {
   element: InlineAdElement;
   readOnly: boolean;
}) {
   if (readOnly) {
      return (
         <>
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
         </>
      );
   }
   return (
      <div
         className="bg-zinc-100  dark:bg-dark350 rounded-md my-5 w-[300px] mx-auto h-[250px] 
         tablet:w-[728px] flex items-center justify-center tablet:h-[90px] text-zinc-400 dark:text-zinc-500"
      >
         <div className="space-y-1">
            <div className="text-center text-xs text-1 font-semibold">
               Ad Banner
            </div>
            <div className="text-center text-[10px] justify-center flex items-center gap-0.5">
               <span className="">728x90</span>
               <Icon name="chevron-down" size={14} />
            </div>
         </div>
      </div>
   );
}
