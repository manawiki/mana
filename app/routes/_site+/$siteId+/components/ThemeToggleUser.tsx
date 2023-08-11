import { useState } from "react";

import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

import { Theme, useTheme } from "~/utils/theme-provider";

export const ThemeToggleUser = () => {
   const [theme, setTheme] = useTheme();

   const toggleTheme = () => {
      setTheme((prevTheme) =>
         prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
      );
      setEnabled(!enabled);
   };
   const [enabled, setEnabled] = useState(false);

   return (
      <Switch.Group>
         <div
            className="text-1 w-ful flex items-center gap-3 rounded-lg
            p-2 hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
         >
            <Switch.Label className="flex-grow">Theme</Switch.Label>
            <Switch
               checked={enabled}
               onChange={toggleTheme}
               className={clsx(
                  enabled ? "bg-zinc-600" : "bg-zinc-200",
                  "relative inline-flex h-5 w-10 items-center rounded-full"
               )}
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     enabled
                        ? "translate-x-6 bg-white"
                        : "translate-x-1 bg-zinc-500",
                     "inline-flex h-3 w-3 transform items-center justify-center rounded-full transition"
                  )}
               />
               <div
                  className={clsx(
                     enabled ? "left-1.5" : "right-1",
                     "absolute flex  items-center justify-center"
                  )}
               >
                  {enabled ? (
                     <MoonIcon className="h-2.5 w-2.5 text-zinc-400" />
                  ) : (
                     <SunIcon className="h-[13px] w-[13px] text-zinc-500" />
                  )}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
};
