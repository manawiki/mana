// We'll load the game data here and pass it to the visualizing components

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useRouteLoaderData } from "@remix-run/react";

import type {
   ConveneType,
   Resonator,
   Weapon,
} from "payload/generated-custom-types";
import { fetchWithCache } from "~/utils/cache.server";

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const resonators = (
      await fetchWithCache<{ docs: Array<Resonator> }>(
         "http://localhost:4000/api/resonators?limit=1000&sort=id&depth=2)",
      )
   )?.docs;

   const weapons = (
      await fetchWithCache<{ docs: Array<Weapon> }>(
         "http://localhost:4000/api/weapons?limit=1000&sort=id&depth=2",
      )
   )?.docs;

   const conveneTypes = (
      await fetchWithCache<{ docs: Array<ConveneType> }>(
         "http://localhost:4000/api/convene-types?limit=1000&sort=id&depth=2",
      )
   )?.docs;

   const itemImages = (
      await fetchWithCache<{ docs: Array<ConveneType> }>(
         "http://localhost:4000/api/items?where[id][in]=3,50001,50002,50005",
      )
   )?.docs;

   return json({
      resonators,
      weapons,
      conveneTypes,
      itemImages,
   });
}

export async function Layout() {
   return <Outlet />;
}

// parent loader return shortcut, use this to grab wuwa data from the layout
export const useConveneLayoutData = () =>
   useRouteLoaderData<typeof loader>(
      "_custom/routes/_site.convene-tracker+/_layout",
   )!;
