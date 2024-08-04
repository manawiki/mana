import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { Partytown } from "@builder.io/partytown/react";
import type {
   MetaFunction,
   LinksFunction,
   LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import {
   Links,
   LiveReload,
   Meta,
   Outlet,
   Scripts,
   useLoaderData,
   useMatches,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import reactCropUrl from "react-image-crop/dist/ReactCrop.css";
import rdtStylesheet from "remix-development-tools/index.css";
import { getToast } from "remix-toast";
import { Toaster, toast as notify } from "sonner";

import customStylesheetUrl from "~/_custom/styles.css";
import type { Site } from "~/db/payload-types";
import fonts from "~/styles/fonts.css";
import { ClientHintCheck, getHints, useTheme } from "~/utils/client-hints";
import { i18nextServer } from "~/utils/i18n/i18next.server";
import { useIsBot } from "~/utils/isBotProvider";
import { getTheme } from "~/utils/theme.server";

import { ScrollRestoration } from "./components/ScrollRestoration";
import { settings } from "./config";
import { getSiteSlug } from "./routes/_site+/_utils/getSiteSlug.server";
import tailwindStylesheetUrl from "./styles/global.css";

export { ErrorBoundary } from "~/components/ErrorBoundary";

type ContextType = [
   searchToggle: boolean,
   setSearchToggle: Dispatch<SetStateAction<boolean>>,
];

export const loader = async ({
   context: { user, payload },
   request,
}: LoaderFunctionArgs) => {
   const { siteSlug } = await getSiteSlug(request, payload, user);

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

   //@ts-ignore
   const following = userData?.sites?.map((site) => ({
      id: site?.id,
      icon: {
         url: site?.icon?.url,
      },
      domain: site?.domain,
      name: site.name,
      slug: site?.slug,
      type: site?.type,
   }));
   const hints = getHints(request);

   const stripePublicKey = process.env.STRIPE_PUBLIC_KEY ?? "";

   return json(
      {
         requestInfo: {
            ...hints,
            theme: getTheme(request) ?? hints.theme,
         },
         stripePublicKey,
         toast,
         locale,
         user,
         siteSlug,
         following,
      },
      { headers },
   );
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [
   { title: settings.title },
   { charSet: "utf-8" },
];

export const links: LinksFunction = () => [
   { rel: "preconnect", href: "https://static.mana.wiki" },

   //preload css makes it nonblocking to html renders
   { rel: "preload", href: fonts, as: "style" },
   { rel: "preload", href: tailwindStylesheetUrl, as: "style" },
   { rel: "preload", href: customStylesheetUrl, as: "style" },
   { rel: "preload", href: reactCropUrl, as: "style" },

   { rel: "stylesheet", href: reactCropUrl },
   { rel: "stylesheet", href: fonts },
   { rel: "stylesheet", href: tailwindStylesheetUrl },
   { rel: "stylesheet", href: customStylesheetUrl },

   {
      rel: "preload",
      href: "/fonts/Nunito_Sans/NunitoSans-Regular.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
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
   const { locale, toast } = useLoaderData<typeof loader>();
   const { i18n } = useTranslation();
   const isBot = useIsBot();
   const theme = useTheme();

   useChangeLanguage(locale);

   //site data should live in layout, this may be potentially brittle if we shift site architecture around
   const { site } = (useMatches()?.[1]?.data as { site: Site | null }) ?? {
      site: null,
   };

   // Hook to show the toasts
   useEffect(() => {
      if (toast?.type === "error") {
         notify.error(toast.message);
      }
      if (toast?.type === "success") {
         notify.success(toast.message);
      }
   }, [toast]);

   const [searchToggle, setSearchToggle] = useState(false);

   return (
      <html
         lang={locale}
         dir={i18n.dir()}
         className={`font-body scroll-smooth ${theme ?? ""}`}
      >
         <head>
            {!isBot && <ClientHintCheck />}
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
            {/* add preconnect to cdn to improve first bits */}
            {site?.favicon?.url ? (
               <>
                  <link
                     sizes="32x32"
                     rel="icon"
                     type="image/x-icon"
                     href={`${site?.favicon?.url}?width=32&height=32`}
                  />
                  <link
                     sizes="128x128"
                     rel="icon"
                     type="image/x-icon"
                     href={`${site?.favicon?.url}?width=128&height=128`}
                  />
                  <link
                     sizes="180x180"
                     rel="icon"
                     type="image/x-icon"
                     href={`${site?.favicon?.url}?width=180&height=180`}
                  />
                  <link
                     sizes="192x192"
                     rel="icon"
                     type="image/x-icon"
                     href={`${site?.favicon?.url}?width=192&height=192`}
                  />
               </>
            ) : (
               <link
                  sizes="32x32"
                  rel="icon"
                  type="image/x-icon"
                  href="/favicon.ico"
               />
            )}
            {process.env.NODE_ENV === "production" && !isBot && (
               <Partytown
                  debug={false}
                  forward={["dataLayer.push"]}
                  resolveUrl={(url, location, type) => {
                     //proxy gtag requests to avoid cors issues
                     if (
                        type === "script" &&
                        url.host === "www.googletagmanager.com"
                     ) {
                        return new URL(
                           location.origin +
                              "/proxy" +
                              url.pathname +
                              url.search,
                        );
                     }
                     return url;
                  }}
               />
            )}
            <Meta />
            <Links />
         </head>
         <body className="text-light dark:text-dark">
            <div
               vaul-drawer-wrapper=""
               className="max-laptop:min-h-screen bg-white dark:bg-bg3Dark"
            >
               <Outlet
                  context={
                     [searchToggle, setSearchToggle] satisfies ContextType
                  }
               />
            </div>
            <Toaster theme={theme ?? "system"} />
            <ScrollRestoration />
            {!isBot && <Scripts />}
            <LiveReload />
         </body>
      </html>
   );
}

// Toggle Remix Dev Tools
// if (process.env.NODE_ENV === "development") {
//    const { withDevTools } = require("remix-development-tools");

//    AppExport = withDevTools(AppExport);
// }

export default App;

export function useChangeLanguage(locale: string) {
   let { i18n } = useTranslation();
   useEffect(() => {
      i18n.changeLanguage(locale);
   }, [locale, i18n]);
}

// don't revalidate loader when url param changes
export function shouldRevalidate({
   currentUrl,
   nextUrl,
   formMethod,
   defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
   return currentUrl.pathname === nextUrl.pathname && formMethod === "GET"
      ? false
      : defaultShouldRevalidate;
}
