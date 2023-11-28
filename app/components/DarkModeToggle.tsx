import { Theme, Themed, useTheme } from "~/utils/theme-provider";

import { Icon } from "./Icon";

export const DarkModeToggle = () => {
   const [, setTheme] = useTheme();

   const toggleTheme = () => {
      setTheme((prevTheme) =>
         prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
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
                  <Icon name="moon" size={18} className="text-1" />
               </button>
            }
            light={
               <button
                  className="flex h-8 w-8 items-center justify-center"
                  onClick={toggleTheme}
                  aria-label="Toggle light mode"
               >
                  <Icon name="sun" size={18} className="text-1" />
               </button>
            }
         />
      </div>
   );
};
