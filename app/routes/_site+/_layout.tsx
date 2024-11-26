import { useEffect, useState } from "react";

import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";

import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import * as gtag from "~/utils/gtags.client";
import { useIsBot } from "~/utils/isBotProvider";

import { ColumnOne } from "./_components/Column-1";
import { ColumnTwo } from "./_components/Column-2";
import { ColumnFour } from "./_components/Column-4";
import { MobileHeader } from "./_components/MobileHeader";
import { RampInit } from "./_components/RampInit";
import { AdUnit } from "./_components/RampUnit";
import { SiteHeader } from "./_components/SiteHeader";
import { fetchSite } from "./_utils/fetchSite.server";
import { Icon } from "~/components/Icon";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const site = await fetchSite({ siteSlug, user, request, payload });

   return await json({ site });
}

export default function SiteLayout() {
   const { site } = useLoaderData<typeof loader>() || {};
   const isBot = useIsBot();

   const [isPrimaryMenu, setPrimaryMenuOpen] = useState(false);

   const adWebId = site?.adWebId;
   const gaTrackingId = site?.gaTagId;
   const enableAds = site?.enableAds;

   return (
      <>
         {process.env.NODE_ENV === "production" && !isBot && gaTrackingId && (
            <GAScript gaTrackingId={gaTrackingId} />
         )}
         <MobileHeader />

         <main
            className="laptop:grid laptop:min-h-screen laptop:auto-cols-[70px_60px_1fr_334px] 
           laptop:grid-flow-col desktop:auto-cols-[70px_230px_1fr_334px] max-laptop:mb-[50px] max-laptop:border-b max-laptop:border-color"
         >
            <ColumnOne />
            <ColumnTwo
               isPrimaryMenu={isPrimaryMenu}
               setPrimaryMenuOpen={setPrimaryMenuOpen}
            />

            <section className="bg-3 max-laptop:min-h-[140px]">
               {site?.announcementMessage &&
                  (site?.announcementLink ? (
                     <Link
                        to={site?.announcementLink}
                        className="gap-2 h-9 text-sm bg-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200
                           dark:bg-zinc-100 w-full flex items-center justify-between px-2.5"
                     >
                        <div className="flex items-center justify-between w-full laptop:max-w-[732px] mx-auto">
                           <div className="flex items-center gap-2">
                              <Icon
                                 className="dark:text-zinc-600 text-zinc-400"
                                 name="info"
                                 size={16}
                              />
                              <span className="font-bold text-xs text-zinc-50 dark:text-zinc-800">
                                 {site?.announcementMessage}
                              </span>
                           </div>
                           <span className="flex items-center gap-1">
                              <span
                                 className="underline underline-offset-4 decoration-zinc-700 dark:decoration-zinc-300
                              text-xs text-zinc-200 dark:text-zinc-700 font-semibold"
                              >
                                 Learn more
                              </span>
                              <Icon
                                 name="chevron-right"
                                 className="dark:text-zinc-500 text-zinc-400"
                                 size={16}
                              />
                           </span>
                        </div>
                     </Link>
                  ) : (
                     <div
                        className="gap-2 h-9 text-sm bg-zinc-900 hover:bg-zinc-800
                     dark:bg-zinc-100 w-full flex items-center justify-center px-3 font-bold 
                     text-zinc-50 dark:text-zinc-800"
                     >
                        {site?.announcementMessage}
                     </div>
                  ))}
               <SiteHeader
                  isPrimaryMenu={isPrimaryMenu}
                  setPrimaryMenuOpen={setPrimaryMenuOpen}
               />

               <Outlet />
            </section>
            <ColumnFour />
         </main>
         {process.env.NODE_ENV === "production" && !isBot && enableAds && (
            <RampInit adWebId={adWebId} />
         )}
         <AdUnit
            className="tablet:hidden fixed bottom-0 left-0 w-full h-[50px] z-50 bg-3 flex items-center justify-center"
            enableAds={enableAds}
            adType={{
               mobile: "leaderboard_btf",
            }}
            selectorId="mobileBottomSticky"
         />
      </>
   );
}

export function GAScript({ gaTrackingId }: { gaTrackingId: string }) {
   const location = useLocation();
   useEffect(() => {
      gtag.pageview(location.pathname, gaTrackingId);
   }, [location, gaTrackingId]);

   return (
      <>
         <script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
         />
         <script
            defer
            id="gtag-init"
            dangerouslySetInnerHTML={{
               __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${gaTrackingId}', {
      page_path: window.location.pathname,
    });
  `,
            }}
         />
      </>
   );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
   return [
      {
         title: data?.site.name,
      },
   ];
};

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
