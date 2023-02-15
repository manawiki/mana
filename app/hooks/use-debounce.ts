import { useState, useEffect, useRef } from "react";

export function useDebouncedValue<T>(input: T, time = 500) {
   const [debouncedValue, setDebouncedValue] = useState(input);

   // every time input value has changed - set interval before it's actually commited
   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebouncedValue(input);
      }, time);

      return () => {
         clearTimeout(timeout);
      };
   }, [input, time]);

   return debouncedValue;
}

//Checks if initial render is mounted, used to prevent useEffect from running on initial render
export const useIsMount = () => {
   const isMountRef = useRef(true);
   useEffect(() => {
      isMountRef.current = false;
   }, []);
   return isMountRef.current;
};
