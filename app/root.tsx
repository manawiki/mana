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
import { useTranslation } from "react-i18next";
import rdtStylesheet from "remix-development-tools/index.css";
import { getToast } from "remix-toast";
import { ExternalScripts } from "remix-utils/external-scripts";
import { Toaster, toast as notify } from "sonner";

import { settings } from "mana-config";
import customStylesheetUrl from "~/_custom/styles.css";
import type { Site } from "~/db/payload-types";
import fonts from "~/styles/fonts.css";
import { ClientHintCheck, getHints } from "~/utils/client-hints";
import { useIsBot } from "~/utils/isBotProvider";
import { getTheme } from "~/utils/theme";

import tailwindStylesheetUrl from "./styles/global.css";
import { i18nextServer } from "./utils/i18n";
import { rdtClientConfig } from "../rdt.config";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export const loader = async ({
   context: { user, payload },
   request,
}: LoaderFunctionArgs) => {
   const locale = await i18nextServer.getLocale(request);

   // Extracts the toast from the request
   const { toast, headers } = await getToast(request);

   const userData = user
      ? await payload.findByID({
           collection: "users",
           id: user.id,
           user,
        })
      : undefined;

   const following = userData?.sites?.map((site) => ({
      id: site?.id,
      icon: {
         url: site?.icon?.url,
      },
      name: site.name,
      slug: site?.slug,
      type: site?.type,
   }));

   const hints = getHints(request);

   return json(
      {
         requestInfo: {
            ...hints,
            theme: getTheme(request) ?? hints.theme,
         },
         toast,
         locale,
         user,
         following,
      },
      { headers },
   );
};

export const meta: MetaFunction = () => [
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
   ...(process.env.NODE_ENV === "development"
      ? [{ rel: "stylesheet", href: rdtStylesheet }]
      : []),
];

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "auth",
};

function App() {
   const { locale, requestInfo, toast } = useLoaderData<typeof loader>();
   const { i18n } = useTranslation();
   const isBot = useIsBot();

   useChangeLanguage(locale);

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };
   const favicon = site?.favicon?.url ?? site?.icon?.url ?? "/favicon.ico";

   // Hook to show the toasts
   useEffect(() => {
      if (toast?.type === "error") {
         notify.error(toast.message);
      }
      if (toast?.type === "success") {
         notify.success(toast.message);
      }
   }, [toast]);

   return (
      <html
         lang={locale}
         dir={i18n.dir()}
         className={`font-body scroll-smooth ${requestInfo?.theme ?? ""}`}
      >
         <head>
            <ClientHintCheck />
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
         </head>
         <body className="text-light dark:text-dark">
            <Outlet />
            <Toaster theme={requestInfo?.theme ?? "system"} />
            <ScrollRestoration />
            {isBot ? null : <Scripts />}
            <ExternalScripts />
            <LiveReload />
         </body>
      </html>
   );
}

let AppExport = withMetronome(App);

// Toggle Remix Dev Tools
if (process.env.NODE_ENV === "development") {
   const { withDevTools } = require("remix-development-tools");

   AppExport = withDevTools(AppExport, rdtClientConfig);
}

export default AppExport;

export function useChangeLanguage(locale: string) {
   let { i18n } = useTranslation();
   useEffect(() => {
      i18n.changeLanguage(locale);
   }, [locale, i18n]);
}
