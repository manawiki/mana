import { useEffect, useState } from "react";

import { useLocation } from "@remix-run/react";

export function RampInit({ adWebId }: { adWebId?: string | null | undefined }) {
   const { pathname } = useLocation();

   const [rampComponentLoaded, setRampComponentLoaded] = useState(false);

   const oopUnits = [{ type: "corner_ad_video" }];

   // Function to add ad units
   const addUnits = () => {
      //@ts-ignore
      window.ramp.que.push(() => {
         //@ts-ignore
         window.ramp
            .addUnits(oopUnits)
            //@ts-ignore
            .catch((e) => console.warn("Error adding units:", e))
            //@ts-ignore
            .finally(() => window.ramp.displayUnits());
      });
   };

   // Cleanup function to remove ad units
   const cleanUp = () => {
      //@ts-ignore
      if (!window.ramp?.settings?.slots) return;
      //@ts-ignore
      const slotsToRemove = Object.keys(window.ramp.settings.slots);
      //@ts-ignore
      if (slotsToRemove && slotsToRemove.length > 0) {
         //@ts-ignore
         window.ramp.destroyUnits(slotsToRemove).then(addUnits);
         //@ts-ignore
         window.PageOS.session.newPageView();
      }
   };

   useEffect(() => {
      if (!rampComponentLoaded) {
         setRampComponentLoaded(true);
         //@ts-ignore
         window.ramp = window.ramp || {};
         //@ts-ignore
         window.ramp.que = window.ramp.que || [];
         //@ts-ignore
         window.ramp.passiveMode = true;
         // Load the Ramp configuration script
         const configScript = document.createElement("script");
         configScript.src = `https://cdn.intergient.com/1025133/${
            adWebId ? adWebId : "74686"
         }/ramp.js`;
         document.head.appendChild(configScript);
         configScript.onload = addUnits;
      }
      // Cleanup function to remove units on component unmount
      return () => {
         cleanUp();
      };
   }, [rampComponentLoaded, pathname]); // Removed router.asPath to prevent unnecessary re - runs;

   // Effect to handle path updates

   useEffect(() => {
      let currentPath = pathname;
      if (currentPath === "/") return;
      if (!rampComponentLoaded) return;
      //@ts-ignore
      window.ramp.que.push(() => {
         //@ts-ignore
         window.ramp.setPath(currentPath || "");
      });
   }, [pathname, rampComponentLoaded]);

   return null;
}
