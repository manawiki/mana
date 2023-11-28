import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

import { Icon } from "~/components/Icon";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/src/functions";

type AdUnitType =
   | "desktopLeaderATF"
   | "desktopLeaderBTF"
   | "desktopSquareATF"
   | "desktopSquareBTF"
   | "mobileSquareATF"
   | "mobileSquareBTF";

type AdSlotType = {
   type: string;
   platform: "desktop" | "mobile";
};

const AD_UNITS = {
   desktopLeaderATF: { type: "leaderboard_atf", platform: "desktop" }, //728x90
   desktopLeaderBTF: { type: "leaderboard_btf", platform: "desktop" }, //728x90
   desktopSquareATF: { type: "med_rect_atf", platform: "desktop" }, //300x250
   desktopSquareBTF: { type: "med_rect_btf", platform: "desktop" }, //300x250
   mobileSquareATF: { type: "med_rect_atf", platform: "mobile" }, //300x250
   mobileSquareBTF: { type: "med_rect_btf", platform: "mobile" }, //300x250
};

function AdUnitSelector({
   adType,
   className,
   selectorId,
}: {
   adType: AdUnitType;
   selectorId: string;
   className?: string;
}) {
   const adsInit = useRef(false);
   const { pathname } = useLocation();

   //@ts-ignore
   //Prepare units array to send to ramp
   const adSlot = AD_UNITS[adType] as AdSlotType;

   const { platform, ...prunedPlatform } = adSlot;

   const units = [{ selectorId, ...prunedPlatform }];

   const init = function () {
      //@ts-ignore
      window.ramp
         .addUnits(units)
         .then(() => {
            adsInit.current = true;
            //@ts-ignore
            window.ramp.displayUnits();
         })
         .catch((e: any) => {
            //@ts-ignore
            window.ramp.displayUnits();
            console.error(e);
         });
   };
   //Push ads on initial load
   useEffect(() => {
      //@ts-ignore
      window.ramp && window.ramp.que.push(init);
   }, []);

   //Destroy then update ads on path change
   useEffect(() => {
      //Only destroy then update ads that already exist
      if (adsInit.current === true) {
         //@ts-ignore
         // possible that component was removed before first ad was created
         if (!window.ramp.settings || !window.ramp.settings.slots) return;

         let slotToRemove = null;
         //@ts-ignore
         Object.entries(window.ramp.settings.slots).forEach(
            ([slotName, slot]) => {
               if (
                  //@ts-ignore
                  slot.element &&
                  //@ts-ignore
                  slot.element.parentElement &&
                  //@ts-ignore
                  slot.element.parentElement.id === selectorId
               ) {
                  slotToRemove = slotName;
               }
            },
         );
         if (slotToRemove) {
            //@ts-ignore
            window.ramp.destroyUnits(slotToRemove);
            //@ts-ignore
            window.ramp.que.push(init);
         }
      }
   }, [pathname]);

   if (adSlot.platform == "desktop")
      return (
         <div
            data-pw-desk={adSlot.type}
            className={className}
            //@ts-ignore
            ref={adsInit}
            id={selectorId}
         />
      );
   if (adSlot.platform == "mobile")
      return (
         <div
            data-pw-mobi={adSlot.type}
            className={className}
            //@ts-ignore
            ref={adsInit}
            id={selectorId}
         />
      );
}

export function AdUnit({
   adType,
   selectorId,
   className,
   enableAds,
}: {
   adType: AdUnitType;
   selectorId: string;
   className?: string;
   enableAds?: boolean | undefined | null;
}) {
   if (enableAds) {
      return (
         <ClientOnly fallback={<></>}>
            {() => (
               <AdUnitSelector
                  adType={adType}
                  selectorId={selectorId}
                  className={className}
               />
            )}
         </ClientOnly>
      );
   }
}

export function AdPlaceholder({ children }: { children?: ReactNode }) {
   const hasAccess = useIsStaffOrSiteAdminOrStaffOrOwner();

   if (hasAccess || !children)
      return (
         <div
            className="bg-zinc-50 dark:bg-dark350 rounded-md my-5 w-[300px] mx-auto h-[250px] shadow-sm shadow-1
          tablet:w-[728px] flex items-center justify-center tablet:h-[90px] text-zinc-400 dark:text-zinc-500
          border border-color-sub relative overflow-hidden"
         >
            <div
               className="pattern-diagonal-lines pattern-zinc-100 pattern-bg-zinc-50 dark:pattern-dark400 dark:pattern-bg-dark350
               pattern-size-4 pattern-opacity-20 w-full h-full absolute top-0 -z-0 left-0"
            ></div>
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
   return children;
}
