import { useEffect, useMemo } from "react";

import { useLocation } from "@remix-run/react";

// OTHER
export function ScrollToHashElement() {
   let location = useLocation();

   let hashElement = useMemo(() => {
      let hash = location.hash;
      const removeHashCharacter = (str: string) => {
         const result = str.slice(1);
         return result;
      };

      if (hash) {
         let element = document.getElementById(removeHashCharacter(hash));
         return element;
      } else {
         return null;
      }
   }, [location]);

   useEffect(() => {
      if (hashElement) {
         hashElement.scrollIntoView({
            behavior: "smooth",
            // block: "end",
            inline: "nearest",
         });
      }
   }, [hashElement]);

   return null;
}
