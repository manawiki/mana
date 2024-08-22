import { useState } from "react";

import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import type { ShouldRevalidateFunctionArgs } from "@remix-run/react";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";

import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";

import { ColumnOne } from "./_components/Column-1";
import { ColumnTwo } from "./_components/Column-2";
import { ColumnFour } from "./_components/Column-4";
import { GAScripts } from "./_components/GAScripts";
import { MobileHeader } from "./_components/MobileHeader";
import { RampInit } from "./_components/RampInit";
import { AdUnit } from "./_components/RampUnit";
import { SiteHeader } from "./_components/SiteHeader";
import { fetchSite } from "./_utils/fetchSite.server";

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
   const gaTag = site?.gaTagId;
   const adWebId = site?.adWebId;

   const [isPrimaryMenu, setPrimaryMenuOpen] = useState(false);

   return (
      <>
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
            <section className="bg-3 max-laptop:pt-14 max-laptop:min-h-[140px]">
               <SiteHeader
                  isPrimaryMenu={isPrimaryMenu}
                  setPrimaryMenuOpen={setPrimaryMenuOpen}
               />
               <Outlet />
            </section>
            <ColumnFour />
         </main>
         <RampInit adWebId={adWebId} />
         <ClientOnly fallback={<></>}>
            {() => (
               <>
                  <GAScripts gaTrackingId={gaTag} />
               </>
            )}
         </ClientOnly>
         <AdUnit
            className="fixed bottom-0 left-0 w-full h-[50px] z-50 bg-3 flex items-center justify-center"
            enableAds={site?.enableAds}
            adType={{
               tablet: "leaderboard_btf",
               mobile: "leaderboard_btf",
            }}
            selectorId="mobileBottomSticky"
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
