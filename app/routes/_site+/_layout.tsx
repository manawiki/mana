import { useEffect } from "react";

import { json } from "@remix-run/node";
import type {
   LoaderFunctionArgs,
   MetaFunction,
   SerializeFrom,
} from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import type { ExternalScriptsHandle } from "remix-utils/external-scripts";

import { useSearchToggleState } from "~/root";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import * as gtag from "~/utils/gtags.client";

import { ColumnOne } from "./_components/Column-1";
import { ColumnTwo } from "./_components/Column-2";
import { ColumnThree } from "./_components/Column-3";
import { ColumnFour } from "./_components/Column-4";
import { GAScripts } from "./_components/GAScripts";
import { MobileHeader } from "./_components/MobileHeader";
import { RampScripts } from "./_components/RampScripts";
import { fetchSite } from "./_utils/fetchSite.server";
import { GoogleAnalytics } from "~/utils/ga";

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
   const gaTag = site?.gaTagId;
   const enableAds = site?.enableAds;

   const [, setSearchToggle] = useSearchToggleState();

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTag) {
         gtag.pageview(location.pathname, gaTag);
      }
      //Hide the search on path change
      setSearchToggle(false);
   }, [location, gaTag]);

   return (
      <>
         <MobileHeader />
         <main
            className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_60px_1fr_334px] 
                     laptop:grid-flow-col desktop:auto-cols-[76px_230px_1fr_334px]"
         >
            <ColumnOne />
            <ColumnTwo />
            <ColumnThree />
            <ColumnFour />
         </main>
         <GoogleAnalytics gaId={gaTag} />
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

export let handle: ExternalScriptsHandle<SerializeFrom<typeof loader>> = {
   scripts({ data }) {
      const enableAds = data?.site?.enableAds;
      const gaTag = data?.site?.gaTagId;

      //Load ad scripts if enabled
      const gAnalytics = `https://www.googletagmanager.com/gtag/js?id=${gaTag}`;
      const rampConfig =
         "https://cdn.intergient.com/1025133/74686/ramp_config.js";
      const rampCore = "https://cdn.intergient.com/ramp_core.js";

      if (enableAds && gaTag && process.env.NODE_ENV === "production") {
         return [gAnalytics, rampConfig, rampCore].map((src) => ({
            src,
            defer: true,
            preload: true,
         }));
      }

      //Otherwise just load analytics
      if (gaTag && process.env.NODE_ENV === "production") {
         return [
            {
               src: gAnalytics,
               defer: true,
               preload: true,
            },
         ];
      }

      return [];
   },
};
