import { Label, Switch } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { useTheme } from "~/utils/client-hints";

export function ThemeToggleDesktop() {
   const theme = useTheme();
   const fetcher = useFetcher();

   return (
      <Switch.Group>
         <div className="p-4 rounded-xl border border-color-sub bg-2-sub shadow-sm dark:shadow-zinc-800/50 mb-6 flex items-start justify-between">
            <div className="flex-grow">
               <Label className="font-bold pb-0.5 block text-sm">Theme</Label>
               <div className="text-1 text-sm">Change the site theme</div>
            </div>
            <Switch
               className="border-zinc-200 bg-white dark:border-zinc-500/60 dark:bg-dark500 relative
               shadow-sm shadow-1 inline-flex h-7 w-[51px] items-center rounded-full border"
               checked={Boolean(theme === "dark")}
               onChange={() =>
                  fetcher.submit(
                     { theme: theme === "light" ? "dark" : "light" },
                     { method: "POST", action: "/action/theme-toggle" },
                  )
               }
            >
               <span className="sr-only">Theme</span>
               <div
                  className={clsx(
                     theme == "dark"
                        ? "translate-x-7 bg-white"
                        : "translate-x-1.5 bg-zinc-500",
                     "inline-flex h-4 w-4 transform items-center justify-center rounded-full transition",
                  )}
               />
               <div
                  className={clsx(
                     theme == "dark" ? "left-1.5" : "right-1.5",
                     "absolute flex  items-center justify-center",
                  )}
               >
                  {theme == "dark" ? (
                     <Icon
                        name="moon"
                        title="Dark Mode"
                        className="h-3.5 w-3.5 text-zinc-400"
                     />
                  ) : (
                     <Icon
                        name="sun"
                        title="Light Mode"
                        className="h-3.5 w-3.5 text-zinc-500"
                     />
                  )}
               </div>
            </Switch>
         </div>
      </Switch.Group>
   );
}
