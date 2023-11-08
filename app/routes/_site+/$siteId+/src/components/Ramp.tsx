import { useEffect, useRef } from "react";

import { useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

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
   | "pwDeskLbAtf" //728x90
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

export function RampScripts() {
   return (
      <>
         <script
            async
            data-cfasync="false"
            dangerouslySetInnerHTML={{
               __html: `
                     window.ramp = window.ramp || {};
                     window.ramp.que = window.ramp.que || [];
                     window.ramp.passiveMode = true;
                     `,
            }}
         />
         <script
            data-cfasync="false"
            async
            src="//cdn.intergient.com/1025133/74686/ramp_config.js"
         />
         <script
            data-cfasync="false"
            dangerouslySetInnerHTML={{
               __html: `
                     window._pwGA4PageviewId = ''.concat(Date.now());
                     window.dataLayer = window.dataLayer || [];
                     window.gtag = window.gtag || function () {
                       dataLayer.push(arguments);
                     };
                     gtag('js', new Date());
                     gtag('config', 'G-T3DKG2SG5T', { 'send_page_view': false });
                     gtag(
                       'event',
                       'ramp_js',
                       {
                         'send_to': 'G-T3DKG2SG5T',
                         'pageview_id': window._pwGA4PageviewId
                       }
                     );
                     `,
            }}
         />
         <script
            data-cfasync="false"
            async
            src="//cdn.intergient.com/ramp_core.js"
         />
      </>
   );
}

function AdUnitSelector({ adId }: { adId: AdUnitType }) {
   const adsInit = useRef(false);
   const { pathname } = useLocation();

   const units = [
      {
         selectorId: `pwDeskMedRectAtf`,
         type: "med_rect_atf",
      },
   ];

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
   //@ts-ignore
   if (!adsInit.current) {
      //@ts-ignore
      window.ramp && window.ramp.que.push(init);
   }

   useEffect(() => {
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

   //@ts-ignore
   return <div ref={adsInit} id={adId}></div>;
}

export const AdUnit = ({ adId }: { adId: AdUnitType }) => {
   return (
      <ClientOnly fallback={<></>}>
         {() => <AdUnitSelector adId={adId} />}
      </ClientOnly>
   );
};
