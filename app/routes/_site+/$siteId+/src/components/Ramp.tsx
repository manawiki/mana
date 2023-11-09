import { useEffect, useRef } from "react";

import type { SerializeFrom } from "@remix-run/node";
import { useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

import type { loader as siteType } from "~/routes/_site+/$siteId+/_layout";

type AdUnitType =
   | "pwDeskLbAtf" //728x90
   | "pwDeskLbBtf1"
   | "pwDeskLbBtf2"
   | "pwDeskLbBtf3"
   | "pwDeskLbBtf4"
   | "pwDeskLbBtf5"
   | "pwDeskMedRectAtf" //300x250
   | "pwDeskMedRectBtf1"
   | "pwDeskMedRectBtf2"
   | "pwDeskMedRectBtf3"
   | "pwDeskMedRectBtf4"
   | "pwDeskMedRectBtf5"
   | "pwMobiLbAtf"
   | "pwMobiLbBtf1"
   | "pwMobiLbBtf2"
   | "pwMobiLbBtf3"
   | "pwMobiLbBtf4"
   | "pwMobiLbBtf5"
   | "pwMobiMedRectAtf" //300x250
   | "pwMobiMedRectBtf1"
   | "pwMobiMedRectBtf2"
   | "pwMobiMedRectBtf3"
   | "pwMobiMedRectBtf4"
   | "pwMobiMedRectBtf5";

type AdSlotType = {
   type: string;
   platform: "desktop" | "mobile";
};

const AD_UNITS = {
   pwDeskLbAtf: { type: "leaderboard_atf", platform: "desktop" }, //728x90
   pwDeskLbBtf1: { type: "leaderboard_btf", platform: "desktop" }, //728x90
   pwDeskMedRectAtf: { type: "med_rect_atf", platform: "desktop" }, //300x250
   pwDeskMedRectBtf1: { type: "med_rect_btf", platform: "desktop" }, //300x250
   pwMobiMedRectAtf: { type: "med_rect_atf", platform: "mobile" }, //300x250
   pwMobiMedRectBtf1: { type: "med_rect_btf", platform: "mobile" }, //300x250
};

function AdUnitSelector({
   adId,
   className,
}: {
   adId: AdUnitType;
   className?: string;
}) {
   const adsInit = useRef(false);
   const { pathname } = useLocation();

   //@ts-ignore
   //Prepare units array to send to ramp
   const adSlot = AD_UNITS[adId] as AdSlotType;

   const { platform, ...prunedPlatform } = adSlot;

   const units = [{ selectorId: adId, ...prunedPlatform }];

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
                  slot.element.parentElement.id === adId
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
            id={adId}
         />
      );
   if (adSlot.platform == "mobile")
      return (
         <div
            data-pw-mobi={adSlot.type}
            className={className}
            //@ts-ignore
            ref={adsInit}
            id={adId}
         />
      );
}

export function AdUnit({
   adId,
   className,
   site,
}: {
   adId: AdUnitType;
   className?: string;
   site?: SerializeFrom<typeof siteType>["site"];
}) {
   if (site?.enableAds && process.env.NODE_ENV === "production") {
      return (
         <ClientOnly fallback={<></>}>
            {() => <AdUnitSelector adId={adId} className={className} />}
         </ClientOnly>
      );
   }
}
