import { useEffect } from "react";

import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";

import { useSearchToggleState } from "~/root";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";

import { ColumnOne } from "./_components/Column-1";
import { ColumnTwo } from "./_components/Column-2";
import { ColumnThree } from "./_components/Column-3";
import { ColumnFour } from "./_components/Column-4";
import { GAScripts } from "./_components/GAScripts";
import { MobileHeader } from "./_components/MobileHeader";
import { RampScripts } from "./_components/RampScripts";
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
   const location = useLocation();
   const gaTag = site?.gaTagId as any as string;
   const enableAds = site?.enableAds as any as boolean;

   const [, setSearchToggle] = useSearchToggleState();

   useEffect(() => {
      //Google Analytics automatically tracks pageviews when the browser history state changes. This means that client-side navigations between Next.js routes will send pageview data without any configuration.
      // if (process.env.NODE_ENV === "production" && gaTag) {
      //    gtag.pageview(location.pathname, gaTag);
      // }

      //Hide the search on path change
      setSearchToggle(false);
   }, [setSearchToggle, location]);

   return (
      <>
         <MobileHeader />
         <main
            className="laptop:grid laptop:min-h-screen laptop:auto-cols-[70px_60px_1fr_334px] 
           laptop:grid-flow-col desktop:auto-cols-[70px_230px_1fr_334px]"
         >
            <ColumnOne />
            <ColumnTwo />
            <ColumnThree />
            <ColumnFour />
         </main>
         <GAScripts gaTrackingId={gaTag} />
         <RampScripts enableAds={enableAds} />
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
