// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   ClientLoaderFunctionArgs,
   Form,
   useLoaderData,
} from "@remix-run/react";

import type { Resonator, Weapon } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { fetchWithCache } from "~/utils/cache.server";

import gachas from "./gacha.json";
import { GachaGraph } from "./GachaGraph";
import { GachaHistory } from "./GachaHistory";
import { GachaSummary } from "./GachaSummary";

const banner_data: Record<
   string,
   { name: string; type: number; res_id: string }
> = {
   "1": {
      name: "Utternace of Marvels", // 20% OFF starter banner, 50 rolls guaranteed 5-star at end.
      type: 5, // Beginner Convene
      res_id: "4df1ed7da8530acc4263774922de7d7",
   },
   "2": {
      name: "Tidal Chorus", // Standard Resonator Banner
      type: 3, // Standard Resonator Convene
      res_id: "6a6544dd7ce748e541a528967e4395c8",
   },
   "3": {
      name: "???", // Unnamed in the files, it uses the selected item name.
      type: 4, // Standard Weapon Convene
      res_id: "a859ca595b193b96502fe3af3cb7726f",
   },
   "4": {
      name: "???", // Unnamed in the files, 80 rolls guaranteed selected 5-star at end.
      type: 6, // Beginner's Choice Convene
      res_id: "917dfa695d6c6634ee4e972bb9168f6a",
   },
   "5": {
      name: "???", // Unnamed in the files, free 5* resonator choice. Uses resonator name.
      type: 7, // Beginner's Choice Convene (Giveback Custom Convene)
      res_id: "48e034de667fdca4b2538397e6fb5d26",
   },
   "100001": {
      name: "Prevail the Lasting Night",
      type: 1,
      res_id: "5c13a63f85465e9fcc0f24d6efb15083",
   },
   "200001": {
      name: "Absolute Pulsation",
      type: 2,
      res_id: "663ab75b8820a61fc09a91b45dafa1f0",
   },
};

type RollData = {
   cardPoolType: string;
   resourceId: number;
   qualityLevel: number;
   resourceType: string;
   name: string;
   count: number;
   time: string;
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

   // we'll load player Data from the client
   // const gacha = await getData({ cardPoolId, url: searchParams.get("url") });

   return json({
      resonators,
      weapons,
      gacha: { data: [] as RollData[] },
      banner: banner_data[cardPoolId],
   });
}

export default function HomePage() {
   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="Warp History" />
         <div className="justify-left flex items-center gap-x-1">
            <Form method="GET">
               <label htmlFor="url">Import URL</label>
               <input name="url" placeholder="" type="url" className="w-full" />
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

// we'll load player Data from the client
export const clientLoader = async ({
   request,
   params,
   serverLoader,
}: ClientLoaderFunctionArgs) => {
   // call the server loader
   const serverData = await serverLoader<typeof loader>();

   // get the cardPoolId from request searchParams
   const { searchParams } = new URL(request.url);

   const cardPoolId = searchParams.get("cardPoolId") || "1";

   const gacha = await (
      await getData({ cardPoolId, url: searchParams.get("url") })
   ).json();

   // Return the data to expose through useLoaderData()
   return { ...serverData, gacha };
};

async function getData({
   cardPoolId,
   url,
}: {
   cardPoolId: string;
   url: string | null;
}) {
   const { searchParams } = new URL(
      url || "https://gmserver-api.aki-game2.net/gacha/record/query",
   );

   let base_payload = {
      playerId: searchParams.get("playerId") || "500016561",
      serverId:
         searchParams.get("serverId") || "591d6af3a3090d8ea00d8f86cf6d7501",
      languageCode: searchParams.get("languageCode") || "en",
      cardPoolId:
         banner_data[cardPoolId]?.res_id || "4df1ed7da8530acc4263774922de7d7",
      cardPoolType: banner_data[cardPoolId]?.type || "5",
      recordId:
         searchParams.get("recordId") || "cb1d1f2269e5442124eff6540823a570",
   };

   const response = await fetch(
      "https://gmserver-api.aki-game2.net/gacha/record/query",
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(base_payload),
      },
   );

   return response;
}

clientLoader.hydrate = true;

export const HydrateFallback = () => (
   <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
      <H2 text="Warp History" />
      <div className="justify-left flex items-center gap-x-1">
         <Form method="GET">
            <label htmlFor="url">Import URL</label>
            <input name="url" placeholder="" type="url" className="w-full" />
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
      <div className="flex items-center justify-center h-96">
         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      {/* <GachaSummary /> */}
      {/* <GachaGraph /> */}
      {/* <GachaHistory /> */}
   </div>
);
