import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useLocation } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

import { Icon } from "~/components/Icon";
import { useIsStaffOrSiteAdminOrStaffOrOwner } from "~/routes/_auth+/utils/useIsStaffSiteAdminOwner";

type AdUnitType =
   | "leaderboard_atf"
   | "leaderboard_btf"
   | "med_rect_atf"
   | "med_rect_btf"
   | "corner_ad_video";

function AdUnitSelector({
   adType,
   className,
   selectorId,
}: {
   adType: AdUnitType | undefined;
   selectorId: string;
   className?: string;
}) {
   const { pathname } = useLocation();

   // Function to add ad units
   const addUnits = () => {
      //@ts-ignore
      window.ramp?.que?.push(() => {
         //@ts-ignore
         window.ramp
            .addUnits([{ type: adType, selectorId: selectorId }])
            //@ts-ignore
            .catch((e) => console.warn("Error adding units:", e))
            //@ts-ignore
            .finally(() => window.ramp.displayUnits());
      });
   };

   // Cleanup function to remove ad units
   const cleanUp = () => {
      //@ts-ignore
      const slots = window.ramp?.settings?.slots;
      if (!slots) return;
      const slotToRemove = Object.entries(slots).find(
         //@ts-ignore
         ([_, slot]) => slot.element?.parentElement?.id === selectorId,
      )?.[0];
      if (slotToRemove) {
         //@ts-ignore
         window.ramp?.destroyUnits([slotToRemove]);
      }
   };

   useEffect(() => {
      addUnits();
      return () => cleanUp();
   }, [adType, selectorId, pathname]);

   return <div className={className} id={selectorId} />;
}

export function AdUnit({
   adType,
   selectorId,
   className,
   enableAds,
}: {
   adType: {
      mobile?: AdUnitType;
      tablet?: AdUnitType;
      desktop?: AdUnitType;
   };
   selectorId: string;
   className?: string;
   enableAds?: boolean | undefined | null;
}) {
   const { pathname } = useLocation();

   const [deviceType, setDeviceType] = useState({
      isDesktop: false,
      isTablet: false,
      isMobile: false,
   });

   useEffect(() => {
      // Check screen size on initial load and resize
      const checkScreenSize = () => {
         if (typeof window !== "undefined") {
            setDeviceType({
               isDesktop: window.innerWidth > 1240,
               isTablet: window.innerWidth >= 768 && window.innerWidth <= 1240,
               isMobile: window.innerWidth < 767,
            });
         }
      };
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => {
         window.removeEventListener("resize", checkScreenSize);
      };
   }, [pathname]);

   const [startDetect, setStartDetect] = useState(true);
   const [detected, setDetected] = useState(false);

   // Run Adblock detection
   useEffect(() => {
      if (startDetect && enableAds && process.env.NODE_ENV === "production") {
         detectAdblock((enable) => {
            setStartDetect(false);
            setDetected(enable);
         });
      }
   }, [startDetect, enableAds]);

   if (!enableAds) return <></>;

   // set Default height to fix ad cls, only in production when adblock is not detected
   if (!detected && process.env.NODE_ENV === "production")
      className = className + " h-[250px] tablet:h-[90px]";

   return (
      <ClientOnly fallback={<div className={className} />}>
         {() => (
            <>
               {!detected && deviceType.isMobile && adType.mobile ? (
                  <AdUnitSelector
                     adType={adType.mobile}
                     selectorId={selectorId}
                     className={className}
                  />
               ) : undefined}
               {!detected && deviceType.isTablet && adType.tablet ? (
                  <AdUnitSelector
                     adType={adType.tablet}
                     selectorId={selectorId}
                     className={className}
                  />
               ) : undefined}
               {!detected && deviceType.isDesktop && adType.desktop ? (
                  <AdUnitSelector
                     adType={adType.desktop}
                     selectorId={selectorId}
                     className={className}
                  />
               ) : undefined}
            </>
         )}
      </ClientOnly>
   );
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

/**
 * Check status of network connection
 *
 * @returns boolean
 */
const is_connected = () => {
   return window.navigator.onLine;
};

function detectByGoogleAd(callback: (enable: boolean) => void) {
   let head = document.getElementsByTagName("head")[0] as HTMLElement;
   let script = document.createElement("script") as HTMLScriptElement;
   let done = false;
   let windowElement: typeof window & { adsbygoogle?: string };

   if (!is_connected()) {
      callback(false);
      return;
   }

   const reqURL =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
   script.setAttribute("src", reqURL);
   script.setAttribute("type", "text/javascript");
   script.setAttribute("charset", "utf-8");

   let alreadyDetectedByAdd = false;
   script.onload = () => {
      if (!done) {
         done = true;
         script.onload = null;

         if (windowElement?.adsbygoogle == "undefined") {
            callback(true);
            alreadyDetectedByAdd = true;
         }
         script.parentNode?.removeChild(script);
      }
   };

   /** On Error. */
   script.onerror = function () {
      callback(true);
   };

   /** If Already Detectecd by adding scripts */
   if (alreadyDetectedByAdd) {
      return;
   }

   /** Async */
   let callbacked = false;
   const request = new XMLHttpRequest();
   request.open("GET", reqURL, true);
   request.onreadystatechange = () => {
      if (
         request.status === 0 ||
         (request.status >= 200 && request.status < 400)
      ) {
         if (
            request.responseText.toLowerCase().indexOf("ublock") > -1 ||
            request.responseText.toLowerCase().indexOf("height:1px") > -1
         ) {
            if (callbacked) {
               callback(true);
               return;
            }
            callbacked = true;
         }
      }

      if (!callbacked) {
         callback(request.responseURL !== reqURL);
         return;
      }
   };

   request.send();
   head.insertBefore(script, head.firstChild);
}

export function detectAdblock(callback: (enable: boolean) => void) {
   /** Check Other Adblock Extensions with the help of googlead */
   detectByGoogleAd(function (blocked) {
      if (blocked) {
         callback(true);
      } else {
         callback(false);
      }
   });
}
