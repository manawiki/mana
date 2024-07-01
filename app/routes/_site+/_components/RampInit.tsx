import { useEffect } from "react";

export function RampInit({
   enableAds,
}: {
   enableAds: boolean | null | undefined;
}) {
   //Push tagless units ads on initial load
   const init = function () {
      //@ts-ignore
      window.ramp
         .addUnits([
            {
               type: "corner_ad_video",
            },
         ])
         .then(() => {
            //@ts-ignore
            window.ramp.displayUnits();
            //@ts-ignore
         })
         .catch((e: any) => {
            //@ts-ignore
            window.ramp.displayUnits();
            console.error(e);
         });
   };

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && enableAds) {
         //@ts-ignore
         window.ramp && window.ramp.que.push(init);
      }
   }, []);
   return null;
}
