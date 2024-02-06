import { useLoaderData } from "@remix-run/react";

import type { loader as siteLoaderType } from "~/routes/_site+/_layout";

import { ColumnOneMenu } from "./Column-1-Menu";

export function ColumnOne() {
   const { site } = useLoaderData<typeof siteLoaderType>();

   return (
      <section
         className="bg-1 border-color relative top-0 z-50
         max-laptop:fixed max-laptop:w-full laptop:border-r"
      >
         <div
            className="top-0 hidden max-laptop:py-2 laptop:fixed laptop:left-0 laptop:block 
            laptop:h-full laptop:w-[70px] laptop:overflow-y-auto laptop:pt-3 no-scrollbar"
         >
            <ColumnOneMenu site={site} />
         </div>
      </section>
   );
}
