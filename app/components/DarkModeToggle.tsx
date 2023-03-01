import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Theme, Themed, useTheme } from "~/utils/theme-provider";

export const DarkModeToggle = () => {
   const [, setTheme] = useTheme();

   const toggleTheme = () => {
      setTheme((prevTheme) =>
         prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
      );
   };

   return (
      <div className="h-8 w-8">
         <Themed
            dark={
               <button
                  className="flex h-8 w-8 items-center justify-center"
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
               >
                  <MoonIcon className="h-5 w-5 text-1" />
               </button>
            }
            light={
               <button
                  className="flex h-8 w-8 items-center justify-center"
                  onClick={toggleTheme}
                  aria-label="Toggle light mode"
               >
                  <SunIcon className="h-6 w-6 text-1" />
               </button>
            }
         />
      </div>
   );
};
