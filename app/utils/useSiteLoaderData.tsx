import type { SerializeFrom } from "@remix-run/node";
import { useMatches, useRouteLoaderData } from "@remix-run/react";

import type { loader as rootLoaderType } from "~/root";
import type { loader as layoutLoaderType } from "~/routes/_site+/_layout";

// export typesafe helpers to get shared loaders from hierachy

// export a typesafe function to get the root data
export function useRootLoaderData() {
   //the ! will tell TS that the type is not nullable (not null or undefined)
   return useRouteLoaderData<typeof rootLoaderType>("root")!;
}

// get site data from layout loader
export function useSiteLoaderData() {
   //the ! will tell TS that the type is not nullable (not null or undefined)
   // return useRouteLoaderData<typeof loader>("routes/_site+/_layout")!

   // more brittle since we're using the layout hierarchy
   return (
      (useMatches()?.[1]?.data as SerializeFrom<typeof layoutLoaderType>) ?? {
         site: undefined,
      }
   );
}
