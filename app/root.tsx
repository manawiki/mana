import { useEffect } from "react";

import { withMetronome } from "@metronome-sh/react";
import type {
   MetaFunction,
   LinksFunction,
   LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Links,
   LiveReload,
   Meta,
   Outlet,
   Scripts,
   ScrollRestoration,
   useLoaderData,
   useMatches,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
// import rdtStylesheet from "remix-development-tools/index.css?url";
import rdtStylesheet from "remix-development-tools/index.css";
import { ExternalScripts } from "remix-utils/external-scripts";

import { settings } from "mana-config";
import type { Site } from "~/db/payload-types";
import { useIsBot } from "~/utils/isBotProvider";
import {
   ThemeBody,
   ThemeHead,
   ThemeProvider,
   useTheme,
} from "~/utils/theme-provider";
import { getThemeSession } from "~/utils/theme.server";

import { toast } from "./components/Toaster";
import { i18nextServer } from "./utils/i18n";
import { commitSession, getSession } from "./utils/message.server";
import type { ToastMessage } from "./utils/message.server";
// import { rdtClientConfig } from "../rdt.config";

//css should be imported as side effect for vite
import "./styles/global.css";
import "~/_custom/styles.css";
import "~/styles/fonts.css";

export const loader = async ({
   context: { user },
   request,
}: LoaderFunctionArgs) => {
   const themeSession = await getThemeSession(request);
   const locale = await i18nextServer.getLocale(request);
   const session = await getSession(request.headers.get("cookie"));
   const toastMessage = (session.get("toastMessage") as ToastMessage) ?? null;

   const sharedData = {
      toastMessage,
      locale,
      user,
      siteTheme: themeSession.getTheme(),
   };

   return json(
      { ...sharedData },
      { headers: { "Set-Cookie": await commitSession(session) } },
   );
};

export const meta: MetaFunction = () => [
   { title: settings.title },
   { charSet: "utf-8" },
];

export const links: LinksFunction = () => [
   //add preconnects to cdn to improve first bits
   {
      rel: "preconnect",
      href: `https://${settings.domain}`,
      crossOrigin: "anonymous",
   },
   {
      rel: "preconnect",
      href: `https://${
         settings.siteId ? `${settings.siteId}-static` : "static"
      }.mana.wiki`,
      crossOrigin: "anonymous",
   },

   //add dns-prefetch as fallback support for older browsers
   { rel: "dns-prefetch", href: `https://static.mana.wiki` },
   {
      rel: "dns-prefetch",
      href: `https://${
         settings.siteId ? `${settings.siteId}-static` : "static"
      }.mana.wiki`,
   },
   // ...(process.env.NODE_ENV === "development"
   //    ? [{ rel: "stylesheet", href: rdtStylesheet }]
   //    : []),
];

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

function App() {
   const { locale, siteTheme, toastMessage } = useLoaderData<typeof loader>();
   const [theme] = useTheme();
   const { i18n } = useTranslation();
   const isBot = useIsBot();

   useChangeLanguage(locale);

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };
   const favicon = site?.favicon?.url ?? site?.icon?.url ?? "/favicon.ico";

   useEffect(() => {
      if (!toastMessage) {
         return;
      }
      const { message, type } = toastMessage;

      switch (type) {
         case "success":
            toast.success(message);
            break;
         case "error":
            toast.error(message);
            break;
         default:
            throw new Error(`${type} is not handled`);
      }
   }, [toastMessage]);

   return (
      <html
         lang={locale}
         dir={i18n.dir()}
         className={`font-body scroll-smooth ${theme ?? ""}`}
      >
         <head>
            <meta charSet="utf-8" />
            <meta
               name="viewport"
               content="initial-scale=1, viewport-fit=cover, width=device-width"
               viewport-fit="cover"
            />
            <meta
               name="format-detection"
               content="telephone=no, date=no, email=no, address=no"
            />
            <link
               sizes="32x32"
               rel="icon"
               type="image/x-icon"
               href={`${favicon}?width=32&height=32`}
            />
            <link
               sizes="128x128"
               rel="icon"
               type="image/x-icon"
               href={`${favicon}?width=128&height=128`}
            />
            <link
               sizes="180x180"
               rel="icon"
               type="image/x-icon"
               href={`${favicon}?width=180&height=180`}
            />
            <link
               sizes="192x192"
               rel="icon"
               type="image/x-icon"
               href={`${favicon}?width=192&height=192`}
            />
            <Meta />
            <Links />
            <ThemeHead ssrTheme={Boolean(siteTheme)} />
         </head>
         <body className="text-light dark:text-dark">
            <Outlet />
            <Toaster />
            <ThemeBody ssrTheme={Boolean(siteTheme)} />
            <ScrollRestoration />
            <ExternalScripts />
            <LiveReload />
            {isBot ? null : <Scripts />}
         </body>
      </html>
   );
}

export function AppWithProviders() {
   const { siteTheme } = useLoaderData<typeof loader>();

   return (
      <ThemeProvider specifiedTheme={siteTheme}>
         <App />
      </ThemeProvider>
   );
}

let AppExport = withMetronome(AppWithProviders);

// Toggle Remix Dev Tools
// if (process.env.NODE_ENV === "development") {
//    const { withDevTools } = require("remix-development-tools");

//    AppExport = withDevTools(AppExport, rdtClientConfig);
// }

export default AppExport;

export function useChangeLanguage(locale: string) {
   let { i18n } = useTranslation();
   useEffect(() => {
      i18n.changeLanguage(locale);
   }, [locale, i18n]);
}
