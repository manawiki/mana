import type { Dispatch, SetStateAction } from "react";

import { Outlet } from "@remix-run/react";

import { SiteHeader } from "./SiteHeader";

export function ColumnThree({
   setSearchToggle,
   searchToggle,
}: {
   setSearchToggle: Dispatch<SetStateAction<boolean>>;
   searchToggle: boolean;
}) {
   return (
      <>
         <section className="max-laptop:border-color bg-3 max-laptop:border-b max-laptop:pt-14 max-laptop:min-h-[140px]">
            <SiteHeader
               setSearchToggle={setSearchToggle}
               searchToggle={searchToggle}
            />
            <Outlet />
         </section>
      </>
   );
}
