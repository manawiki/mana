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
import tooltipStyles from "react-tooltip/dist/react-tooltip.css";

import { i18nextServer } from "./utils/i18n";
import fonts from "~/styles/fonts.css";
import { commitSession, getSession } from "./utils/message.server";
import { useEffect } from "react";
import { toast } from "./components/Toaster";

export const loader = async ({ context: { user }, request }: LoaderArgs) => {
   const themeSession = await getThemeSession(request);
   const locale = await i18nextServer.getLocale(request);
   const session = await getSession(request.headers.get("cookie"));
   const toastMessage = (session.get("toastMessage") as ToastMessage) ?? null;
   return json(
      {
         toastMessage,
         locale,
         user,
         siteTheme: themeSession.getTheme(),
      },
      { headers: { "Set-Cookie": await commitSession(session) } }
   );
};

export const meta: V2_MetaFunction = () => {
   return [
      { title: "Mana - Build Better Wikis" },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const links: LinksFunction = () => [
   //logo font
   { rel: "preload", href: "https://use.typekit.net/lak0idb.css", as: "style" },
   { rel: "stylesheet", href: "https://use.typekit.net/lak0idb.css" },
   {
      rel: "preconnect",
      href: "https://use.typekit.net",
      crossOrigin: "anonymous",
   },
   { rel: "preload", href: tooltipStyles, as: "style" },
   { rel: "stylesheet", href: tooltipStyles },
   //preload css makes it nonblocking to html renders
   { rel: "preload", href: fonts, as: "style" },
   { rel: "stylesheet", href: fonts },

   { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
   { rel: "stylesheet", href: tailwindStylesheetUrl },
];

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

function App() {
   const { locale, siteTheme, toastMessage } = useLoaderData<typeof loader>();
   const [theme] = useTheme();
   const { i18n } = useTranslation();

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
               content="width=device-width,initial-scale=1"
            />
            <Meta />
            <Links />
            <ThemeHead ssrTheme={Boolean(siteTheme)} />
         </head>
         <body className="text-light dark:text-dark ">
            <Outlet />
            <Toaster />
            <ThemeBody ssrTheme={Boolean(siteTheme)} />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
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
