import { createCookieSessionStorage } from "@remix-run/node";

import { isTheme } from "./theme-provider";
import type { Theme } from "./theme-provider";

const sessionSecret = process.env.PAYLOADCMS_SECRET ?? "DEFAULT_SECRET";
const isDev = process.env.NODE_ENV == "development";

const themeStorage = createCookieSessionStorage({
   cookie: {
      name: "theme",
      secure: isDev ? false : true,
      path: "/",
      domain: isDev ? "localhost" : ".mana.wiki",
      secrets: [sessionSecret],
      httpOnly: isDev ? false : true,
      sameSite: isDev ? "lax" : "none",
   },
});

async function getThemeSession(request: Request) {
   const session = await themeStorage.getSession(request.headers.get("Cookie"));
   return {
      getTheme: () => {
         const themeValue = session.get("theme");
         return isTheme(themeValue) ? themeValue : null;
      },
      setTheme: (theme: Theme) => session.set("theme", theme),
      commit: () => themeStorage.commitSession(session),
   };
}

export { getThemeSession };
