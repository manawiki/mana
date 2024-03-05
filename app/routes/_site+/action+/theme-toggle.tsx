import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { useTheme } from "~/utils/client-hints";
import { setTheme } from "~/utils/theme.server";

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
      { success: true, theme: theme },
      {
         headers: {
            "Set-Cookie": setTheme(theme, request),
         },
      },
   );
};

export const DarkModeToggle = ({ className }: { className?: string }) => {
   const theme = useTheme();
   const fetcher = useFetcher<typeof action>();

   return (
      <fetcher.Form method="POST" action="/action/theme-toggle">
         <input
            type="hidden"
            name="theme"
            value={theme === "light" ? "dark" : "light"}
         />
         <button
            className={clsx(
               "flex size-8 items-center justify-center",
               className,
            )}
            aria-label="Toggle dark mode"
         >
            {theme === "light" ? (
               <Icon title="Dark" name="sun" size={18} className="text-1" />
            ) : (
               <Icon title="Light" name="moon" size={18} className="text-1" />
            )}
         </button>
      </fetcher.Form>
   );
};
