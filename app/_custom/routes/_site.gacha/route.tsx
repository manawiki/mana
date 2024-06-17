// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   type ClientLoaderFunctionArgs,
   Form,
   useLoaderData,
   useSearchParams,
   useSubmit,
} from "@remix-run/react";

import type {
   ConveneType,
   Resonator,
   Weapon,
} from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { fetchWithCache } from "~/utils/cache.server";

import {
   addGlobalSummary,
   type GlobalSummaryType,
   subGlobalSummary,
   toGlobal,
} from "./addToGlobal";
import { GachaGlobal } from "./GachaGlobal";
import { GachaHistory } from "./GachaHistory";
import { GachaSummary } from "./GachaSummary";
import { type GachaSummaryType, getSummary } from "./getSummary";

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

   // we'll avoid access control for global summary
   async function fetchSummary<T>(id: string) {
      try {
         return (
            await payload.findByID({
               collection: "user-data",
               id,
               overrideAccess: true,
            })
         ).data as T;
      } catch (e) {
         console.error(e);
         return null;
      }
   }

   const globalSummary = await fetchSummary<GlobalSummaryType>(
      "wuwa-convene-" + convene,
   );

   return json({
      resonators,
      weapons,
      conveneTypes,
      convene: conveneTypes?.find((c) => c.id === convene),
      globalSummary,
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

   localStorage.setItem("base_payload", JSON.stringify(base_payload));

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
         <div className="justify-left flex items-center gap-x-1 ">
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
   const submit = useSubmit();

   const summary = getSummary(loaderData);

   function saveSummary() {
      const base_payload = JSON.parse(
         localStorage.getItem("base_payload") || "{}",
      );

      submit(
         { base_payload, summary },
         { method: "POST", navigate: false, encType: "application/json" },
      );
   }

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
         <input
            type="button"
            value="Submit Summary to global"
            onClick={saveSummary}
         />
         <div className="flex flex-col gap-y-1">
            <H2 text={loaderData.convene?.name ?? "Convene"} />
         </div>
         {loaderData.globalSummary && (
            <GachaGlobal summary={loaderData.globalSummary} />
         )}
         <GachaSummary summary={summary} />
         <GachaHistory summary={summary} />
      </div>
   );
}

// todo: currently we're skipping access controls
export async function action({
   request,
   context: { user, payload },
}: ActionFunctionArgs) {
   const { base_payload, summary } = JSON.parse(await request.text()) as {
      base_payload: any;
      summary: GachaSummaryType;
   };

   console.log({ base_payload, summary });

   const id =
      "wuwa-" + base_payload?.playerId + "-" + base_payload?.cardPoolType;

   const globalId = "wuwa-convene-" + base_payload?.cardPoolType;

   let oldPlayerSummary: GachaSummaryType | undefined = undefined,
      oldGlobalSummary: GlobalSummaryType | undefined = undefined;

   try {
      oldPlayerSummary = (
         await payload.findByID({
            collection: "user-data",
            id,
            overrideAccess: true,
         })
      )?.data as GachaSummaryType;

      oldGlobalSummary = (
         await payload.findByID({
            collection: "user-data",
            id: globalId,
            overrideAccess: true,
         })
      )?.data as GlobalSummaryType;
   } catch (e) {
      console.error(e);
   }

   // First we compare the old and new player record
   const addToGlobal = oldPlayerSummary
      ? subGlobalSummary(toGlobal(summary), toGlobal(oldPlayerSummary))
      : toGlobal(summary);

   // Then we calculate the new global summary
   const newGlobalSummary = oldGlobalSummary
      ? addGlobalSummary(oldGlobalSummary, addToGlobal)
      : addToGlobal;

   try {
      // First we'll update the user record with the new summary
      if (oldPlayerSummary) {
         // try to update the record
         await payload.update({
            collection: "user-data",
            id,
            data: {
               data: summary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
            },
         });
      } else {
         console.log("no result, inserting new record");

         await payload.create({
            collection: "user-data",
            data: {
               data: summary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
               id,
            },
         });
      }

      // Then we'll update the global record
      if (oldGlobalSummary) {
         // try to update the record
         await payload.update({
            collection: "user-data",
            id: globalId,
            data: {
               data: newGlobalSummary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
            },
         });
      } else {
         // insert new record
         await payload.create({
            collection: "user-data",
            data: {
               data: newGlobalSummary,
               // @ts-expect-error this is fine
               site: "pogseal-imbhew2r8tg7",
               id: globalId,
            },
         });
      }
   } catch (e) {
      console.error("Error updating userData ", id, e);
   }

   return json({
      success: true,
      oldGlobalSummary,
      newGlobalSummary,
      addToGlobal,
   });
}

// we don't want this to revalidate
export const shouldRevalidate = () => false;
