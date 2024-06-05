// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import type { Resonator, Weapon } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { fetchWithCache } from "~/utils/cache.server";

import gachas from "./gacha.json";
import { GachaGraph } from "./GachaGraph";
import { GachaHistory } from "./GachaHistory";
import { GachaSummary } from "./GachaSummary";

const banner_data: Record<
   number,
   { name: string; type: number; res_id: string }
> = {
   1: {
      name: "Utternace of Marvels", // 20% OFF starter banner, 50 rolls guaranteed 5-star at end.
      type: 5, // Beginner Convene
      res_id: "4df1ed7da8530acc4263774922de7d7",
   },
   2: {
      name: "Tidal Chorus", // Standard Resonator Banner
      type: 3, // Standard Resonator Convene
      res_id: "6a6544dd7ce748e541a528967e4395c8",
   },
   3: {
      name: "???", // Unnamed in the files, it uses the selected item name.
      type: 4, // Standard Weapon Convene
      res_id: "a859ca595b193b96502fe3af3cb7726f",
   },
   4: {
      name: "???", // Unnamed in the files, 80 rolls guaranteed selected 5-star at end.
      type: 6, // Beginner's Choice Convene
      res_id: "917dfa695d6c6634ee4e972bb9168f6a",
   },
   5: {
      name: "???", // Unnamed in the files, free 5* resonator choice. Uses resonator name.
      type: 7, // Beginner's Choice Convene (Giveback Custom Convene)
      res_id: "48e034de667fdca4b2538397e6fb5d26",
   },
   100001: {
      name: "Prevail the Lasting Night",
      type: 1,
      res_id: "5c13a63f85465e9fcc0f24d6efb15083",
   },
   200001: {
      name: "Absolute Pulsation",
      type: 2,
      res_id: "663ab75b8820a61fc09a91b45dafa1f0",
   },
};

export async function loader({
   context: { payload },
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

   // get the cardPoolId from request searchParams
   const { searchParams } = new URL(request.url);

   const cardPoolId = searchParams.get("cardPoolId") || "1";

   //match the cardPoolId to the banner_data object keys
   const key = Object.keys(banner_data).indexOf(cardPoolId);

   const gacha = gachas.data[key];

   return json({ resonators, weapons, gacha, banner: banner_data[cardPoolId] });
}

export default function HomePage() {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="Warp History" />
         <div className="justify-left flex items-center gap-x-1">
            <Form method="GET">
               <select
                  className="my-2 inline-flex rounded-sm border p-2 dark:bg-neutral-800"
                  name="cardPoolId"
                  onChange={(e) => e.currentTarget.form?.submit()}
               >
                  {Object.entries(banner_data).map(([key, value]) => (
                     <option key={key} value={key}>
                        {value.name}
                     </option>
                  ))}
               </select>
               <input type="submit" value="Submit" />
            </Form>
         </div>
         <GachaSummary />
         {/* <GachaGraph /> */}
         <GachaHistory />
      </div>
   );
}
