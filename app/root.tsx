import type {
   V2_MetaFunction,
   LinksFunction,
   LoaderArgs,
} from "@remix-run/node";
import {
   Links,
   LiveReload,
   Meta,
   Outlet,
   Scripts,
   ScrollRestoration,
   useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import {
   ThemeBody,
   ThemeHead,
   ThemeProvider,
   useTheme,
} from "~/utils/theme-provider";
import { Toaster } from "react-hot-toast";
import type { ToastMessage } from "./utils/message.server";
import { getThemeSession } from "~/utils/theme.server";
import { useTranslation } from "react-i18next";

import tailwindStylesheetUrl from "./styles/global.css";
import customStylesheetUrl from "~/_custom/styles.css";

import { i18nextServer } from "./utils/i18n";
import fonts from "~/styles/fonts.css";
import { commitSession, getSession } from "./utils/message.server";
import { useEffect, lazy } from "react";
import { toast } from "./components/Toaster";
import { useIsBot } from "~/utils/isBotProvider";
import { isNativeSSR } from "./utils";
import { StatusBar } from "@capacitor/status-bar";
import { setBackForwardNavigationGestures } from "capacitor-plugin-ios-webview-configurator";
import { settings } from "mana-config";
import { App as CapacitorApp } from "@capacitor/app";

import rdtStylesheet from "remix-development-tools/stylesheet.css";
const RemixDevTools = lazy(() => import("remix-development-tools"));

export const loader = async ({ context: { user }, request }: LoaderArgs) => {
   const themeSession = await getThemeSession(request);
   const locale = await i18nextServer.getLocale(request);
   const session = await getSession(request.headers.get("cookie"));
   const toastMessage = (session.get("toastMessage") as ToastMessage) ?? null;
   const { isMobileApp, isIOS, isAndroid } = isNativeSSR(request);

   const sharedData = {
      isMobileApp,
      isIOS,
      isAndroid,
      toastMessage,
      locale,
      user,
      siteTheme: themeSession.getTheme(),
   };

   return json(
      { ...sharedData },
      { headers: { "Set-Cookie": await commitSession(session) } }
   );
};

export const meta: V2_MetaFunction = () => [
   { title: settings.title },
   { charSet: "utf-8" },
];

export const links: LinksFunction = () => [
   //preload css makes it nonblocking to html renders
   { rel: "preload", href: fonts, as: "style", crossOrigin: "anonymous" },
   { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
   { rel: "preload", href: customStylesheetUrl, as: "style" },

   { rel: "stylesheet", href: fonts, crossOrigin: "anonymous" },
   { rel: "stylesheet", href: tailwindStylesheetUrl },
   { rel: "stylesheet", href: customStylesheetUrl },

   //add preconnects to cdn to improve first bits
   { rel: "preconnect", href: `https://static.${settings.domain}` },
   {
      rel: "preconnect",
      href: `https://${settings.domain}`,
      crossOrigin: "anonymous",
   },
   {
      rel: "preconnect",
      href: `https://${
         settings.siteId ? `${settings.siteId}-static` : "static"
      }.${settings.domain}`,
      crossOrigin: "anonymous",
   },

   //add dns-prefetch as fallback support for older browsers
   { rel: "dns-prefetch", href: `https://static.${settings.domain}` },
   {
      rel: "dns-prefetch",
      href: `https://${settings.siteId}-static.${settings.domain}`,
   },

   //Remix Devtools
   ...(rdtStylesheet && process.env.NODE_ENV === "development"
      ? [{ rel: "stylesheet", href: rdtStylesheet }]
      : []),
];

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

function App() {
   const { locale, siteTheme, toastMessage, isMobileApp } =
      useLoaderData<typeof loader>();
   const [theme] = useTheme();
   const { i18n } = useTranslation();
   const isBot = useIsBot();
   useChangeLanguage(locale);

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

   //We only want to run this on initial mount

   useEffect(() => {
      if (isMobileApp) {
         setBackForwardNavigationGestures(true);
         StatusBar.setOverlaysWebView({ overlay: true });
         CapacitorApp.addListener("backButton", ({ canGoBack }) => {
            if (!canGoBack) {
               CapacitorApp.exitApp();
            } else {
               window.history.back();
            }
         });
      }
   }, []);

   return (
      <html
         lang={locale}
         dir={i18n.dir()}
         className={`font-body ${theme ?? ""}`}
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
            <Meta />
            <Links />

            <ThemeHead ssrTheme={Boolean(siteTheme)} />
         </head>
         <body className="text-light dark:text-dark">
            <Outlet />
            <Toaster />
            <ThemeBody ssrTheme={Boolean(siteTheme)} />
            <ScrollRestoration
               //https://reactrouter.com/en/main/components/scroll-restoration#getkey
               getKey={(location, matches) => {
                  return location.pathname;
               }}
            />
            {isBot ? null : <Scripts />}
            <LiveReload />
            {process.env.NODE_ENV === "development" && !isMobileApp && (
               <RemixDevTools />
            )}
         </body>
      </html>
   );
}

export default function AppWithProviders() {
   const { siteTheme } = useLoaderData<typeof loader>();

   return (
      <ThemeProvider specifiedTheme={siteTheme}>
         <App />
      </ThemeProvider>
   );
}

export function useChangeLanguage(locale: string) {
   let { i18n } = useTranslation();
   useEffect(() => {
      i18n.changeLanguage(locale);
   }, [locale, i18n]);
}

// const [visible, setVisible] = useState(false);

// useEffect(() => {
//    const onScroll = () => {
//       setVisible(document.documentElement.scrollTop >= 200);
//    };
//    onScroll();
//    document.addEventListener("scroll", onScroll);
//    return () => document.removeEventListener("scroll", onScroll);
// }, []);

//     {visible && (
//    <button
//       className="fixed bottom-14 right-12 z-50 flex
//       h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200
//       bg-white shadow-xl shadow-gray-200 transition duration-200 active:translate-y-0.5
//       dark:border-zinc-600 dark:bg-bg4Dark dark:shadow-zinc-900
//       laptop:hidden"
//       onClick={() =>
//          window.scrollTo({
//             top: 0,
//             behavior: "smooth",
//          })
//       }
//       aria-label="Scroll to top"
//    >
//       <ArrowUp className="text-black dark:text-white" size={20} />
//    </button>
// )}
