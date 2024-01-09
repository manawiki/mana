import type { Dispatch, SetStateAction } from "react";

import { Outlet } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";

import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { SiteHeader } from "./SiteHeader";

export function ColumnThree({
   setSearchToggle,
   searchToggle,
   site,
}: {
   setSearchToggle: Dispatch<SetStateAction<boolean>>;
   searchToggle: boolean;
   site: SerializeFrom<typeof siteLoaderType>["site"];
}) {
   return (
      <>
         <section className="max-laptop:border-color bg-3 max-laptop:border-b max-laptop:pt-14 max-laptop:min-h-[140px]">
            <SiteHeader
               site={site}
               setSearchToggle={setSearchToggle}
               searchToggle={searchToggle}
            />
            <Outlet />
         </section>
      </>
   );
}
