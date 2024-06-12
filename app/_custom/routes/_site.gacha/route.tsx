// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   type ClientLoaderFunctionArgs,
   Form,
   useLoaderData,
   useSearchParams,
} from "@remix-run/react";

import type {
   ConveneType,
   Resonator,
   Weapon,
} from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { fetchWithCache } from "~/utils/cache.server";

import { GachaHistory } from "./GachaHistory";
import { GachaSummary } from "./GachaSummary";
import { getSummary } from "./getSummary";

export type RollData = {
   pity?: number;
   cardPoolType: string;
   resourceId: string;
   qualityLevel: number;
   resourceType: string;
   name: string;
   count: number;
   time: string;
};

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

   const { searchParams } = new URL(request.url);

   const convene = searchParams.get("convene") || "1";

   // we'll load player Data from the client
   // const gacha = await getData({ cardPoolId, url: searchParams.get("url") });

   return json({
      resonators,
      weapons,
      conveneTypes,
      convene: conveneTypes?.find((c) => c.id === convene),
      gacha: { data: [] as RollData[] },
   });
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

   const convene = searchParams.get("convene") || "1";

   const gacha = await (
      await getData({ convene, url: searchParams.get("url") })
   ).json();

   // Return the data to expose through useLoaderData()
   return { ...serverData, gacha };
};

async function getData({
   convene,
   url,
}: {
   convene: string;
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
      cardPoolType: convene || "1",
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

export const HydrateFallback = () => {
   const [searchParams] = useSearchParams();
   const loaderData = useLoaderData<typeof loader>();

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="Warp History" />
         <div className="justify-left flex items-center gap-x-1">
            <Form method="GET">
               <label htmlFor="url">Import URL</label>
               <input name="url" placeholder="" type="url" className="w-full" />
               <select
                  className="my-2 inline-flex rounded-sm border p-2 dark:bg-neutral-800"
                  name="convene"
                  onChange={(e) => e.currentTarget.form?.submit()}
                  defaultValue={searchParams.get("convene") ?? "1"}
               >
                  {loaderData?.conveneTypes?.map((convene) => (
                     <option key={convene.id} value={convene.id}>
                        {convene.name}
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
};

export default function HomePage() {
   const [searchParams] = useSearchParams();
   const loaderData = useLoaderData<typeof loader>();

   const summary = getSummary(loaderData);

   console.log(loaderData.gacha);

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <H2 text="Warp History" />
         <div className="justify-left flex items-center gap-x-1">
            <Form method="GET">
               <label htmlFor="url">Import URL</label>
               <input name="url" placeholder="" type="url" className="w-full" />
               <select
                  className="my-2 inline-flex rounded-sm border p-2 dark:bg-neutral-800"
                  name="convene"
                  onChange={(e) => e.currentTarget.form?.submit()}
                  defaultValue={searchParams.get("convene") ?? "1"}
               >
                  {loaderData?.conveneTypes?.map((convene) => (
                     <option key={convene.id} value={convene.id}>
                        {convene.name}
                     </option>
                  ))}
               </select>
               <input type="submit" value="Submit" />
            </Form>
         </div>
         <GachaSummary summary={summary} />
         {/* <GachaGraph /> */}
         <GachaHistory summary={summary} />
      </div>
   );
}
