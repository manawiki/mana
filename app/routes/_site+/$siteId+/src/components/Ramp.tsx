import { useEffect, useRef } from "react";

import { useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

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
