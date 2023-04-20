import { createCookieSessionStorage } from "@remix-run/node";

import { isTheme } from "./theme-provider";
import type { Theme } from "./theme-provider";

const sessionSecret = process.env.PAYLOADCMS_SECRET ?? "DEFAULT_SECRET";

const themeStorage = createCookieSessionStorage({
   cookie: {
      name: "theme",
      secure:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? false
            : true,
      path: "/",
      domain:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? "localhost"
            : ".mana.wiki",
      secrets: [sessionSecret],
      httpOnly:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? false
            : true,
      sameSite:
         process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT == "local"
            ? "lax"
            : "none",
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
