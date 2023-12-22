import { useEffect, useState } from "react";

import { json } from "@remix-run/node";
import type {
   LoaderFunctionArgs,
   MetaFunction,
   SerializeFrom,
} from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import type { ExternalScriptsHandle } from "remix-utils/external-scripts";

import { isStaffOrSiteAdminOrStaffOrOwnerServer } from "~/routes/_auth+/utils/isStaffSiteAdminOwner.server";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import * as gtag from "~/utils/gtags.client";

import { ColumnOne } from "./_components/Column-1";
import { ColumnTwo } from "./_components/Column-2";
import { ColumnThree } from "./_components/Column-3";
import { ColumnFour } from "./_components/Column-4";
import { GAScripts } from "./_components/GAScripts";
import { MobileHeader } from "./_components/MobileHeader";
import { MobileTray, FollowingTrayContent } from "./_components/MobileTray";
import { RampScripts } from "./_components/RampScripts";
import { UserTrayContent } from "./_components/UserMenu";
import { fetchSite } from "./_utils/fetchSite.server";

export { ErrorBoundary } from "~/components/ErrorBoundary";

export async function loader({
   context: { user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = getSiteSlug(request);

   const site = await fetchSite({ siteSlug, user });

   if (!site) {
      throw new Response(null, {
         status: 404,
         statusText: "Not Found",
      });
   }

   //If site is not set to public, limit access to staff and site admins/owners only
   const hasAccess = isStaffOrSiteAdminOrStaffOrOwnerServer(user, site);

   if (!hasAccess && !site.isPublic) {
      throw new Response(null, {
         status: 404,
         statusText: "Not Found",
      });
   }

   return await json(
      { site },
      {
         headers: {
            "Cache-Control": `public, s-maxage=60${user ? "" : ", max-age=60"}`,
         },
      },
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
      const enableAds = data.site.enableAds;
      const gaTag = data.site.gaTagId;

      //disable scripts in development
      if (process.env.NODE_ENV === "development") return [];

      if (enableAds || gaTag) {
         const gAnalytics = {
            src: `https://www.googletagmanager.com/gtag/js?id=${gaTag}`,
            async: true,
         };
         //Load GTag with ads if enabled
         if (enableAds) {
            const rampConfig = {
               src: "//cdn.intergient.com/1025133/74686/ramp_config.js",
               async: true,
            };
            const rampCore = {
               src: "//cdn.intergient.com/ramp_core.js",
               async: true,
            };
            return [gAnalytics, rampConfig, rampCore];
         }
         //Otherwise just load analytics
         return [gAnalytics];
      }

      return [];
   },
};

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>() || {};
   const fetcher = useFetcher();
   const location = useLocation();
   const [isFollowerMenuOpen, setFollowerMenuOpen] = useState(false);
   const [isUserMenuOpen, setUserMenuOpen] = useState(false);
   const [searchToggle, setSearchToggle] = useState(false);
   const gaTag = site?.gaTagId;
   const enableAds = site?.enableAds;

   useEffect(() => {
      if (process.env.NODE_ENV === "production" && gaTag) {
         gtag.pageview(location.pathname, gaTag);
      }
      //Hide the search on path change
      setSearchToggle(false);
   }, [location, gaTag]);

   return (
      <>
         <MobileHeader
            location={location}
            site={site}
            fetcher={fetcher}
            setFollowerMenuOpen={setFollowerMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
         />
         <main>
            <div
               className="laptop:grid laptop:min-h-screen laptop:auto-cols-[76px_60px_1fr_334px] 
                     laptop:grid-flow-col desktop:auto-cols-[76px_230px_1fr_334px]"
            >
               <ColumnOne site={site} />
               <ColumnTwo site={site} />
               <ColumnThree
                  searchToggle={searchToggle}
                  setSearchToggle={setSearchToggle}
                  site={site}
                  fetcher={fetcher}
               />
               <ColumnFour site={site} />
            </div>

            {/* ==== Follows: Mobile ==== */}
            <MobileTray
               onOpenChange={setFollowerMenuOpen}
               open={isFollowerMenuOpen}
            >
               <FollowingTrayContent
                  site={site}
                  setFollowerMenuOpen={setFollowerMenuOpen}
               />
            </MobileTray>

            {/* ==== User Menu: Mobile ==== */}
            <MobileTray onOpenChange={setUserMenuOpen} open={isUserMenuOpen}>
               <UserTrayContent onOpenChange={setUserMenuOpen} />
            </MobileTray>
         </main>
         <GAScripts gaTrackingId={gaTag} />
         <RampScripts enableAds={enableAds} />
      </>
   );
}
