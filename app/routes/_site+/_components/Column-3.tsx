import { Outlet } from "@remix-run/react";

import { SiteHeader } from "./SiteHeader";

export function ColumnThree() {
   return (
      <>
         <section className="max-laptop:border-color bg-3 max-laptop:border-b max-laptop:pt-14 max-laptop:min-h-[140px]">
            <SiteHeader />
            <Outlet />
         </section>
      </>
   );
}
