import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { useHints } from "~/utils/client-hints";
import { setTheme } from "~/utils/theme";

enum Theme {
   DARK = "dark",
   LIGHT = "light",
   SYSTEM = "system",
}

export const themes: Array<Theme> = Object.values(Theme);

function isTheme(value: unknown): value is Theme {
   return typeof value === "string" && themes.includes(value as Theme);
}

export const action: ActionFunction = async ({ request }) => {
   const requestText = await request.text();
   const form = new URLSearchParams(requestText);
   const theme = form.get("theme");

   if (!isTheme(theme)) {
      return json({
         success: false,
         message: `theme value of ${theme} is not a valid theme`,
      });
   }

   return json(
      { success: true },
      {
         headers: {
            "Set-Cookie": setTheme(theme),
         },
      },
   );
};

export const DarkModeToggle = () => {
   const { theme } = useHints();
   const fetcher = useFetcher<typeof action>();

   return (
      <fetcher.Form method="POST" action="/action/theme-toggle">
         <input
            type="hidden"
            name="theme"
            value={theme === "light" ? "dark" : "light"}
         />
         <button
            className="flex h-8 w-8 items-center justify-center"
            //   onClick={toggleTheme}
            aria-label="Toggle dark mode"
         >
            {theme === "light" ? (
               <Icon name="sun" size={18} className="text-1" />
            ) : (
               <Icon name="moon" size={18} className="text-1" />
            )}
         </button>
      </fetcher.Form>
   );
};
