import { useEffect } from "react";

import { useLocation } from "@remix-run/react";

import { useIsBot } from "~/utils/isBotProvider";

declare global {
   interface Window {
      gtag: (
         option: string,
         gaTrackingId: string,
         options: Record<string, unknown>,
      ) => void;
      dataLayer?: Object[];
   }
}

export function GAScripts({
   gaTrackingId,
}: {
   gaTrackingId: string | undefined | null;
}) {
   let isBot = useIsBot();
   const location = useLocation();

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTrackingId) {
         console.log("GA Scripts attempt: pageview", location.pathname);
         pageview(location.pathname, gaTrackingId);
      }
   }, [location, gaTrackingId]);

   return (
      process.env.NODE_ENV === "production" &&
      gaTrackingId &&
      !isBot && (
         <>
            <script
               type="text/partytown"
               suppressHydrationWarning={true} // to get rid of "text/partytown-x" hydration error warning
               dangerouslySetInnerHTML={{
                  __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaTrackingId}');`,
               }}
            />
            <script
               type="text/partytown"
               suppressHydrationWarning={true} // to get rid of "text/partytown-x" hydration error warning
               src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
         </>
      )
   );
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export const pageview = (url: string, trackingId: string) => {
   if (!window.dataLayer) {
      console.warn(
         "window.dataLayer is not defined. This could mean your google analytics script has not loaded on the page yet.",
      );
      return;
   }
   window.dataLayer?.push("config", trackingId, {
      page_path: url,
   });
   console.log(`gtag pageview: ${url}`);
};

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export const event = ({
   action,
   category,
   label,
   value,
}: Record<string, string>) => {
   if (!window.dataLayer) {
      console.warn(
         "window.dataLayer is not defined. This could mean your google analytics script has not loaded on the page yet.",
      );
      return;
   }
   window.dataLayer?.push("event", action!, {
      event_category: category,
      event_label: label,
      value: value,
   });
   console.log(`gtag event: ${action}`);
};
