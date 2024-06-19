// Track Achievements using Local Storage on this page!
// Note all achievements and subcategories / total roll currency rewards will be included if possible.

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
   Form,
   Outlet,
   useLoaderData,
   useNavigate,
   useParams,
   useSubmit,
} from "@remix-run/react";
import { z } from "zod";

import type {
   ConveneType,
   Resonator,
   Weapon,
} from "payload/generated-custom-types";
import { Button } from "~/components/Button";
import { Checkbox } from "~/components/Checkbox";
import { H2 } from "~/components/Headers";
import { cacheThis, fetchWithCache } from "~/utils/cache.server";

import type { GlobalSummaryType } from "./addToGlobal";
import { GachaGlobal } from "./GachaGlobal";
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

   const convene = params.convene || "1";

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
         console.error(id, e);
         return null;
      }
   }

   const globalSummary = await cacheThis(
      () => fetchSummary<GlobalSummaryType>("wuwa-convene-" + convene),
      "wuwa-convene-" + convene,
   );

   // check user data for wuwa-url
   const userData = user
      ? await fetchSummary<{
           url: string;
           save: string;
           refresh: string;
        }>("wuwa-" + user?.id)
      : { url: "", save: "", refresh: "" };

   // check request cookie for wuwa-url
   let cookieURL = request.headers.get("Cookie")?.split("wuwa-url=")?.[1];

   const wuwaURL = cookieURL || userData?.url;

   return json({
      resonators,
      weapons,
      conveneTypes,
      convene: conveneTypes?.find((c) => c.id === convene),
      globalSummary,
      userData,
      wuwaURL,
   });
}

export default function HomePage() {
   const { convene } = useParams();
   const loaderData = useLoaderData<typeof loader>();
   const submit = useSubmit();
   const navigate = useNavigate();

   async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      // We want to fetch from the client, so submit it manually
      e.preventDefault();

      const body = new FormData(e.currentTarget);

      const result = await getConveneData({ body });

      console.log("this is a local fetch: ", result);

      if (!result || result.error) return alert("Error fetching data");

      // if global is checked, submit to global

      console.log(result);

      // @ts-expect-error this is fine
      submit(result, {
         method: "POST",
         action: "/convene-tracker/" + convene + "/track",
         navigate: false,
         encType: "application/json",
      });
   }

   return (
      <div className="mx-auto max-w-[728px] max-laptop:p-3 laptop:pb-20">
         <select
            className="dark:text-zinc-100 mt-8 mb-3 p-3.5 leading-7 dark:bg-dark400 bg-zinc-50 block shadow-sm dark:shadow-zinc-800/70 border-zinc-200/70
      font-header relative text-lg scroll-mt-32 laptop:scroll-mt-60 rounded-l rounded-r-md py-2 overflow-hidden border shadow-zinc-50 dark:border-zinc-700 w-full"
            name="convene"
            defaultValue={convene ?? "1"}
            onChange={(e) => navigate("/convene-tracker/" + e.target.value)}
         >
            {loaderData?.conveneTypes?.map((convene) => (
               <option key={convene.id} value={convene.id}>
                  {convene.name}
               </option>
            ))}
         </select>
         <H2 text={loaderData.convene?.name ?? "Convene"} />
         {loaderData.globalSummary && (
            <GachaGlobal summary={loaderData.globalSummary} />
         )}
         <h2
            className="dark:shadow-zinc-800/50 border-color relative mb-2.5 mt-8 overflow-hidden rounded-lg
      border-2 font-header text-xl font-bold shadow-sm shadow-zinc-50 dark:bg-dark350"
            id="track"
         >
            <div
               className="pattern-dots absolute left-0
                   top-0 -z-0 h-full dark:text-zinc-100
                     w-full pattern-bg-white pattern-zinc-400 pattern-opacity-10 
                     pattern-size-4 dark:pattern-zinc-500 dark:pattern-bg-bg3Dark"
            />
            <div className="relative h-full w-full px-3.5 py-2.5">
               Import Convene History
            </div>
         </h2>
         <Form
            method="POST"
            navigate={false}
            onSubmit={onSubmit}
            className="justify-left flex items-center gap-x-1"
         >
            <label htmlFor="url">Import URL</label>
            <input
               name="url"
               placeholder="Insert URL here"
               type="url"
               className="w-full"
               defaultValue={loaderData.wuwaURL}
               required
            />
            <input hidden name="convene" value={convene ?? "1"} />
            <Button type="submit" value="Import">
               Import
            </Button>
            <Checkbox
               name="save"
               defaultChecked={
                  loaderData.userData
                     ? Boolean(loaderData.userData?.save)
                     : true
               }
            >
               Share
            </Checkbox>
            {/* <input
                  type="checkbox"
                  name="refresh"
                  defaultChecked={Boolean(loaderData.userData?.refresh)}
               />
               <label htmlFor="refresh">Auto Refresh</label> */}
         </Form>
         <H2 text={loaderData.convene?.name ?? "Convene"} />
         <Outlet />
      </div>
   );
}

const WuwaPayloadSchema = z.object({
   playerId: z.string(),
   serverId: z.string(),
   languageCode: z.string(),
   cardPoolType: z.string(),
   recordId: z.string(),
});

// we'll fetch the data on the client side then save it to the server
export async function getConveneData({ body }: { body: FormData }) {
   const url = body.get("url") as string;
   const convene = (body.get("convene") as string) || "1";
   const save = body.get("save") as string;
   const refresh = body.get("refresh") as string;

   if (!url) return { error: "No URL provided" };

   try {
      const searchParams = new URLSearchParams(url?.split("?")?.[1]);

      const wuwaPayload = WuwaPayloadSchema.parse({
         playerId: searchParams.get("player_id"),
         serverId: searchParams.get("svr_id"),
         languageCode: searchParams.get("lang"),
         cardPoolType: convene,
         recordId: searchParams.get("record_id"),
      });

      const response = await fetch(
         "https://gmserver-api.aki-game2.net/gacha/record/query",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(wuwaPayload),
         },
      );

      const gacha = (await await response.json()) as { data: Array<RollData> };

      const summary = getSummary(gacha, convene);

      return {
         gacha,
         summary,
         playerId: wuwaPayload.playerId,
         convene,
         refresh,
         save,
         url,
      };
   } catch (e) {
      console.error(e);
      return { error: e };
   }
}
